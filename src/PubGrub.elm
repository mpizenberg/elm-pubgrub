module PubGrub exposing
    ( Solution
    , PackagesConfig, solve
    , State, Effect(..), Msg(..)
    , Connectivity(..), init, update
    , Cache, emptyCache, cacheDependencies, cachePackageVersions
    )

{-| PubGrub version solving algorithm.

PubGrub is a version solving algorithm,
written in 2018 by Natalie Weizenbaum
for the Dart package manager.
It is supposed to be very fast and to explain errors
more clearly than the alternatives.
An introductory blog post was
[published on Medium][medium-pubgrub] by its author.

The detailed explanation of the algorithm is
[provided on GitHub][github-pubgrub].
The foundation of the algorithm is based on ASP (Answer Set Programming)
and a book called
"[Answer Set Solving in Practice][potassco-book]"
by Martin Gebser, Roland Kaminski, Benjamin Kaufmann and Torsten Schaub.

[medium-pubgrub]: https://medium.com/@nex3/pubgrub-2fb6470504f
[github-pubgrub]: https://github.com/dart-lang/pub/blob/master/doc/solver.md
[potassco-book]: https://potassco.org/book/

This module provides both a sync (offline) and
an async approach (online, may http request)
for the PubGrub algorithm.
The core of the algorithm is in the PubGrubCore module.


# Common to sync and async

@docs Solution


# Sync

@docs PackagesConfig, solve


# Async

@docs State, Effect, Msg
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


{-| Internal model of the PubGrub algorithm.
-}
type State
    = State { root : String, pgModel : PubGrubCore.Model }


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
                    Debug.todo "The package and version should exist!"

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
update connectivity cache msg model =
    updateEffect msg model
        |> tryUpdateCached connectivity cache


tryUpdateCached : Connectivity -> Cache -> ( State, Effect ) -> ( State, Effect )
tryUpdateCached connectivity (Cache cache) stateAndEffect =
    case stateAndEffect of
        ( _, NoEffect ) ->
            stateAndEffect

        ( _, SignalEnd _ ) ->
            stateAndEffect

        ( model, ListVersions ( package, term ) ) ->
            case connectivity of
                Online ->
                    stateAndEffect

                Offline ->
                    let
                        versions =
                            Dict.get package cache.packages
                                |> Maybe.withDefault []
                                |> filterVersionsWithDependencies package cache.dependencies

                        msg =
                            AvailableVersions package term versions
                    in
                    update connectivity (Cache cache) msg model

        ( State { root, pgModel }, RetrieveDependencies ( package, version ) ) ->
            case Dict.get ( package, Version.toTuple version ) cache.dependencies of
                Nothing ->
                    case connectivity of
                        Online ->
                            stateAndEffect

                        Offline ->
                            let
                                err =
                                    "Dependencies of " ++ package ++ " " ++ Version.toDebugString version ++ " missing."
                            in
                            ( State { root = root, pgModel = pgModel }, SignalEnd (Err err) )

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


filterVersionsWithDependencies :
    String
    -> Dict ( String, ( Int, Int, Int ) ) (List ( String, Range ))
    -> List Version
    -> List Version
filterVersionsWithDependencies package dependencies versions =
    List.filter (\version -> Dict.member ( package, Version.toTuple version ) dependencies) versions


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
