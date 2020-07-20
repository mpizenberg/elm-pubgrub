module PubGrub exposing
    ( Solution
    , PackagesConfig, solve
    , State, stateToString, Effect(..), effectToString, Msg(..)
    , Connectivity(..), init, update
    , Cache, emptyCache, cacheDependencies, cachePackageVersions
    )

{-| PubGrub version solving algorithm.

It consists in efficiently finding a set of packages and versions
that satisfy all the constraints of a given project dependencies.
In addition, when that is not possible,
PubGrub tries to provide a very human-readable and clear
explaination as to why that failed.
Below is an example of explanation present in
the introductory blog post about PubGrub
(elm-pubgrub is almost there ^^).

```txt
Because dropdown >=2.0.0 depends on icons >=2.0.0 and
  root depends on icons <2.0.0, dropdown >=2.0.0 is forbidden.

And because menu >=1.1.0 depends on dropdown >=2.0.0,
  menu >=1.1.0 is forbidden.

And because menu <1.1.0 depends on dropdown >=1.0.0 <2.0.0
  which depends on intl <4.0.0, every version of menu
  requires intl <4.0.0.

So, because root depends on both menu >=1.0.0 and intl >=5.0.0,
  version solving failed.
```

The algorithm is generic and works for any type of dependency system
with the following caracteristics, not only Elm packages.

  - Versions use the semantic versioning scheme (Major.Minor.Patch).
  - Packages cannot be simultaneously present at two different versions.
  - Dependencies are expressed in one of the following forms
      - exact version (`foo 1.0.0 depends bar 1.0.0`)
      - higher or equal version (`foo 1.0.0 depends on bar >= 1.0.0`)
      - stricly lower version (`foo 1.0.0 depends on bar < 2.0.0`)
      - ranges of versions (`foo 1.0.0 depends on bar 1.0.0 <= v < 2.0.0`)

PS: at publication, only the `PubGrub`, `Version`, `Range`, and `Term`
modules will be exposed.
Others are exposed for easy docs usage at the moment.


## API

The algorithm is provided in two forms, synchronous and asynchronous.
The synchronous API is quite straightforward.
The async one uses the `Effect` pattern to be easily integrated
into the TEA architecture.


### Direct sync call

    PubGrub.solve config package version

Where config provides the list of available packages and versions,
as well as the dependencies of every available package.
The call to `PubGrub.solve` for a given package at a given version
will compute the set of packages and versions needed.


### Async API

Sometimes, it is too expensive to provide upfront
the list of all packages and versions,
as well as all dependencies for every one of those.
This may very well require some network or other async requests.
For this reason, it is possible to run the PubGrub algorithm step by step.
Every time an effect may be required, it stops and informs the caller,
which may resume the algorithm once necessary data is loaded.

    PubGrub.update : Connectivity -> Cache -> Msg -> State -> ( State, Effect )

The `Effect` type is public to enable the caller to perform
the required task before resuming.
The `Msg` type is also public to drive the algorithm according
to what was expected in the last effect when resuming.

At any point between two `update` calls,
the caller can change the `Connectivity`
and update the `Cache` of already loaded data.

The algorithm informs the caller that all is done
when the `SignalEnd result` effect is emitted.


# Common to sync and async

@docs Solution


# Sync

@docs PackagesConfig, solve


# Async

@docs State, stateToString, Effect, effectToString, Msg
@docs Connectivity, init, update
@docs Cache, emptyCache, cacheDependencies, cachePackageVersions

-}

import Array exposing (Array)
import Dict exposing (Dict)
import Incompatibility
import PartialSolution
import PubGrubCore
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)



-- Common parts for both sync and async


{-| Internal state of the PubGrub algorithm.
-}
type State
    = State { root : String, pgModel : PubGrubCore.Model }



-- { incompatibilities : List Incompatibility
-- , partialSolution : PartialSolution


{-| Convert a state into a printable string (for human reading).
-}
stateToString : State -> String
stateToString (State { pgModel }) =
    let
        partialSolution =
            PartialSolution.toDebugString pgModel.partialSolution

        incompatibilities =
            pgModel.incompatibilities
                |> List.map (Incompatibility.toDebugString 1 0)
                |> String.join "\n"
    in
    "Partial solution at this stage:\n\n"
        ++ partialSolution
        ++ "\n\nSet of incompatibilities:\n\n"
        ++ incompatibilities


{-| Solution of the algorithm containing the list of required packages
with their version number.
-}
type alias Solution =
    List ( String, Version )


{-| Messages used to progress in the algorithm.

You should pick the one you need depending on the last effect emitted.
For example, the `ListVersions` effect is asking you to retrieve
available versions for a given package.
Once done, inform PubGrub with the `AvailableVersions` message
(and pass around the `Term` value).

-}
type Msg
    = NoMsg
    | AvailableVersions String Term (List Version)
    | PackageDependencies String Version (Maybe (List ( String, Range )))


{-| Those are the effects required by the PubGrub algorithm.
Once emitted, they may require you to retrieve some data,
and then send the adequate message to the algorithm.
-}
type Effect
    = NoEffect
    | ListVersions ( String, Term )
    | RetrieveDependencies ( String, Version )
    | SignalEnd (Result String Solution)


{-| Convert an effect into a printable string (for human reading).
-}
effectToString : Effect -> String
effectToString effect =
    case effect of
        NoEffect ->
            "No effect"

        ListVersions ( package, _ ) ->
            "List existing versions of package " ++ package

        RetrieveDependencies ( package, version ) ->
            "Retrieve the list of dependencies of package "
                ++ package
                ++ " at version "
                ++ Version.toDebugString version

        SignalEnd result ->
            case result of
                Ok _ ->
                    "Solving terminated succesfully"

                Err _ ->
                    "Solving terminated with an error"


updateEffect : Msg -> State -> ( State, Effect )
updateEffect msg ((State { root, pgModel }) as state) =
    case msg of
        AvailableVersions package term versions ->
            case PubGrubCore.pickVersion versions term of
                Just version ->
                    ( state, RetrieveDependencies ( package, version ) )

                Nothing ->
                    let
                        noVersionIncompat =
                            Incompatibility.noVersion package term

                        updatedModel =
                            PubGrubCore.mapIncompatibilities (Incompatibility.merge noVersionIncompat) pgModel
                    in
                    solveRec root package updatedModel

        PackageDependencies package version maybeDependencies ->
            case maybeDependencies of
                Nothing ->
                    let
                        unavailableDepsIncompat =
                            Incompatibility.unavailableDeps package version

                        updatedModel =
                            PubGrubCore.mapIncompatibilities (Incompatibility.merge unavailableDepsIncompat) pgModel
                    in
                    solveRec root package updatedModel

                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package

        NoMsg ->
            ( state, NoEffect )


solveRec : String -> String -> PubGrubCore.Model -> ( State, Effect )
solveRec root package pgModel =
    case PubGrubCore.unitPropagation root package pgModel of
        Err msg ->
            ( State { root = root, pgModel = pgModel }, SignalEnd (Err msg) )

        Ok updatedModel ->
            case PubGrubCore.pickPackage updatedModel.partialSolution of
                Nothing ->
                    case PartialSolution.solution updatedModel.partialSolution of
                        Just solution ->
                            ( State { root = root, pgModel = updatedModel }, SignalEnd (Ok solution) )

                        Nothing ->
                            ( State { root = root, pgModel = updatedModel }
                            , SignalEnd (Err "How did we end up with no package to choose but no solution?")
                            )

                Just packageAndTerm ->
                    ( State { root = root, pgModel = updatedModel }, ListVersions packageAndTerm )


applyDecision : List ( String, Range ) -> String -> Version -> PubGrubCore.Model -> PubGrubCore.Model
applyDecision dependencies package version pgModel =
    let
        depIncompats =
            Incompatibility.fromDependencies package version dependencies

        _ =
            Debug.log ("Add the following " ++ String.fromInt (List.length depIncompats) ++ " incompatibilities from dependencies of " ++ package) ""

        _ =
            depIncompats
                |> List.map (\i -> Debug.log (Incompatibility.toDebugString 1 3 i) "")

        updatedIncompatibilities =
            List.foldr Incompatibility.merge pgModel.incompatibilities depIncompats
    in
    case PartialSolution.addVersion package version depIncompats pgModel.partialSolution of
        Nothing ->
            PubGrubCore.setIncompatibilities updatedIncompatibilities pgModel

        Just updatedPartial ->
            PubGrubCore.Model updatedIncompatibilities updatedPartial



-- SYNC ##############################################################


{-| Configuration of available packages to solve dependencies.
-}
type alias PackagesConfig =
    { listAvailableVersions : String -> List Version
    , getDependencies : String -> Version -> Maybe (List ( String, Range ))
    }


{-| PubGrub version solving algorithm.
-}
solve : PackagesConfig -> String -> Version -> Result String Solution
solve config root version =
    solveRec root root (PubGrubCore.init root version)
        |> updateUntilFinished config


updateUntilFinished : PackagesConfig -> ( State, Effect ) -> Result String Solution
updateUntilFinished config ( state, effect ) =
    case effect of
        SignalEnd result ->
            result

        _ ->
            updateUntilFinished config (updateEffect (performSync config effect) state)


performSync : PackagesConfig -> Effect -> Msg
performSync config effect =
    case effect of
        NoEffect ->
            NoMsg

        ListVersions ( package, term ) ->
            AvailableVersions package term (config.listAvailableVersions package)

        RetrieveDependencies ( package, version ) ->
            config.getDependencies package version
                |> PackageDependencies package version

        SignalEnd _ ->
            -- ? not sure
            NoMsg



-- ASYNC #############################################################


{-| Online or Offline.

In Offline mode, the `ListVersions` effect is never emitted
because we never know if a new version or not may be available,
and thus if the cache contains or not all available versions.
It will always use the list of versions available in cache.

In Offline mode, the `RetrieveDependencies` effect is never emitted.
Either the dependencies are known and it will continue,
or they aren't and it will signal a failure.

-}
type Connectivity
    = Online
    | Offline


{-| Initialize PubGrub algorithm.
-}
init : Connectivity -> Cache -> String -> Version -> ( State, Effect )
init connectivity cache root version =
    solveRec root root (PubGrubCore.init root version)
        |> tryUpdateCached connectivity cache


{-| Update the state of the PubGrub algorithm.
-}
update : Connectivity -> Cache -> Msg -> State -> ( State, Effect )
update connectivity cache msg state =
    updateEffect msg state
        |> tryUpdateCached connectivity cache


tryUpdateCached : Connectivity -> Cache -> ( State, Effect ) -> ( State, Effect )
tryUpdateCached connectivity (Cache cache) stateAndEffect =
    case stateAndEffect of
        ( _, NoEffect ) ->
            stateAndEffect

        ( _, SignalEnd _ ) ->
            stateAndEffect

        ( state, ListVersions ( package, term ) ) ->
            case connectivity of
                Online ->
                    stateAndEffect

                Offline ->
                    let
                        versions =
                            Dict.get package cache.packages
                                |> Maybe.withDefault []

                        msg =
                            AvailableVersions package term versions
                    in
                    update connectivity (Cache cache) msg state

        ( (State { root, pgModel }) as state, RetrieveDependencies ( package, version ) ) ->
            case Dict.get ( package, Version.toTuple version ) cache.dependencies of
                Nothing ->
                    case connectivity of
                        Online ->
                            stateAndEffect

                        Offline ->
                            let
                                msg =
                                    PackageDependencies package version Nothing
                            in
                            update connectivity (Cache cache) msg state

                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package
                        |> tryUpdateCached connectivity (Cache cache)



-- Cache


{-| Cache holding already loaded packages information.
-}
type Cache
    = Cache
        { packagesRaw : Array ( String, Version )
        , packages : Dict String (List Version)
        , dependencies : Dict ( String, ( Int, Int, Int ) ) (List ( String, Range ))
        }


{-| Initial empty cache.
-}
emptyCache : Cache
emptyCache =
    Cache
        { packagesRaw = Array.empty
        , packages = Dict.empty
        , dependencies = Dict.empty
        }


{-| Add dependencies of a package to the cache.
-}
cacheDependencies : String -> Version -> List ( String, Range ) -> Cache -> Cache
cacheDependencies package version deps (Cache cache) =
    if Dict.member ( package, Version.toTuple version ) cache.dependencies then
        Cache cache

    else
        Cache { cache | dependencies = Dict.insert ( package, Version.toTuple version ) deps cache.dependencies }


{-| Add a list of packages and versions to the cache.
-}
cachePackageVersions : List ( String, Version ) -> Cache -> Cache
cachePackageVersions packagesVersions (Cache { packagesRaw, packages, dependencies }) =
    let
        ( updatedRaw, updatePackages ) =
            List.foldl addPackageVersion ( packagesRaw, packages ) packagesVersions
    in
    Cache
        { packagesRaw = updatedRaw
        , packages = updatePackages
        , dependencies = dependencies
        }


addPackageVersion :
    ( String, Version )
    -> ( Array ( String, Version ), Dict String (List Version) )
    -> ( Array ( String, Version ), Dict String (List Version) )
addPackageVersion ( package, version ) ( raw, packages ) =
    case Dict.get package packages of
        Nothing ->
            ( Array.push ( package, version ) raw
            , Dict.insert package [ version ] packages
            )

        Just versions ->
            if List.member version versions then
                ( raw, packages )

            else
                ( Array.push ( package, version ) raw
                , Dict.update package (Maybe.map ((::) version)) packages
                )
