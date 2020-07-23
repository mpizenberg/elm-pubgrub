module PubGrub exposing
    ( Solution
    , PackagesConfig, solve, packagesConfigFromCache
    , State, stateToString, Effect(..), effectToString, Msg(..)
    , init, update
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

PS: at publication, modules in the `PubGrub.Internal` namespace will not be exposed.


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

    PubGrub.update : Cache -> Msg -> State -> ( State, Effect )

The `Effect` type is public to enable the caller to perform
the required task before resuming.
The `Msg` type is also public to drive the algorithm according
to what was expected in the last effect when resuming.

At any point between two `update` calls,
the caller can update the `Cache` of already loaded data.

The algorithm informs the caller that all is done
when the `SignalEnd result` effect is emitted.


# Common to sync and async

@docs Solution


# Sync

@docs PackagesConfig, solve, packagesConfigFromCache


# Async

@docs State, stateToString, Effect, effectToString, Msg
@docs init, update

-}

import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Internal.Core as Core
import PubGrub.Internal.Incompatibility as Incompatibility
import PubGrub.Internal.PartialSolution as PartialSolution
import PubGrub.Internal.Term exposing (Term)
import PubGrub.Range exposing (Range)
import PubGrub.Version as Version exposing (Version)



-- Common parts for both sync and async


{-| Internal state of the PubGrub algorithm.
-}
type State
    = State { root : String, pgModel : Core.Model }


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
            case Core.pickVersion versions term of
                Just version ->
                    ( state, RetrieveDependencies ( package, version ) )

                Nothing ->
                    let
                        noVersionIncompat =
                            Incompatibility.noVersion package term

                        updatedModel =
                            Core.mapIncompatibilities (Incompatibility.merge noVersionIncompat) pgModel
                    in
                    solveRec root package updatedModel

        PackageDependencies package version maybeDependencies ->
            case maybeDependencies of
                Nothing ->
                    let
                        unavailableDepsIncompat =
                            Incompatibility.unavailableDeps package version

                        updatedModel =
                            Core.mapIncompatibilities (Incompatibility.merge unavailableDepsIncompat) pgModel
                    in
                    solveRec root package updatedModel

                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package

        NoMsg ->
            ( state, NoEffect )


solveRec : String -> String -> Core.Model -> ( State, Effect )
solveRec root package pgModel =
    case Core.unitPropagation root package pgModel of
        Err msg ->
            ( State { root = root, pgModel = pgModel }, SignalEnd (Err msg) )

        Ok updatedModel ->
            case Core.pickPackage updatedModel.partialSolution of
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


applyDecision : List ( String, Range ) -> String -> Version -> Core.Model -> Core.Model
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
            Core.setIncompatibilities updatedIncompatibilities pgModel

        Just updatedPartial ->
            Core.Model updatedIncompatibilities updatedPartial



-- SYNC ##############################################################


{-| Configuration of available packages to solve dependencies.
The strategy of which version should be preferably picked in the list of available versions
is implied by the order of the list: first version in the list will be tried first.
-}
type alias PackagesConfig =
    { listAvailableVersions : String -> List Version
    , getDependencies : String -> Version -> Maybe (List ( String, Range ))
    }


{-| Convenient conversion of a cache into available packages configuration.
-}
packagesConfigFromCache : Cache -> PackagesConfig
packagesConfigFromCache cache =
    { listAvailableVersions = Cache.listVersions cache
    , getDependencies = Cache.listDependencies cache
    }


{-| PubGrub version solving algorithm.
-}
solve : PackagesConfig -> String -> Version -> Result String Solution
solve config root version =
    solveRec root root (Core.init root version)
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


{-| Initialize PubGrub algorithm.
-}
init : Cache -> String -> Version -> ( State, Effect )
init cache root version =
    solveRec root root (Core.init root version)
        |> tryUpdateCached cache


{-| Update the state of the PubGrub algorithm.

For messages of the `AvailableVersions` variant,
it is the caller responsability to order the versions in the list
with preferred versions at the beginning of the list.
As such, it is easy to try to pick the newest versions compatible
by ordering the versions with a decreasing order.
Alternatively, it can also be interesting to find the minimal versions
(oldest) in order to verify that the tests pass with those.

-}
update : Cache -> Msg -> State -> ( State, Effect )
update cache msg state =
    updateEffect msg state
        |> tryUpdateCached cache


tryUpdateCached : Cache -> ( State, Effect ) -> ( State, Effect )
tryUpdateCached cache stateAndEffect =
    case stateAndEffect of
        ( State { root, pgModel }, RetrieveDependencies ( package, version ) ) ->
            case Cache.listDependencies cache package version of
                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package
                        |> tryUpdateCached cache

                Nothing ->
                    stateAndEffect

        _ ->
            stateAndEffect
