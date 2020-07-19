module PubGrub exposing
    ( Solution
    , PackagesConfig, solve
    , Cache, emptyCache, cacheDependencies, cachePackageVersions
    , init, update
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

@docs Cache, emptyCache, cacheDependencies, cachePackageVersions
@docs init, update

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


type Model
    = Solving String PubGrubCore.Model
    | Finished (Result String Solution)


{-| Solution of the algorithm containing the list of required packages
with their version number.
-}
type alias Solution =
    List ( String, Version )


type Msg
    = NoMsg
    | AvailableVersions String Term (List Version)
    | PackageDependencies String Version (Maybe (List ( String, Range )))


type Effect
    = NoEffect
    | ListVersions ( String, Term )
    | RetrieveDependencies ( String, Version )


updateEffect : Msg -> Model -> ( Model, Effect )
updateEffect msg model =
    case ( msg, model ) of
        ( AvailableVersions package term versions, Solving root pgModel ) ->
            case PubGrubCore.pickVersion versions term of
                Just version ->
                    ( model, RetrieveDependencies ( package, version ) )

                Nothing ->
                    let
                        noVersionIncompat =
                            Incompatibility.noVersion package term

                        updatedModel =
                            PubGrubCore.mapIncompatibilities (Incompatibility.merge noVersionIncompat) pgModel
                    in
                    solveRec root package updatedModel

        ( PackageDependencies package version maybeDependencies, Solving root pgModel ) ->
            case maybeDependencies of
                Nothing ->
                    Debug.todo "The package and version should exist!"

                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package

        ( _, Finished _ ) ->
            ( model, NoEffect )

        _ ->
            Debug.todo ("This should not happen, " ++ Debug.toString msg ++ "\n" ++ Debug.toString model)


solveRec : String -> String -> PubGrubCore.Model -> ( Model, Effect )
solveRec root package pgModel =
    case PubGrubCore.unitPropagation root package pgModel of
        Err msg ->
            ( Finished (Err msg), NoEffect )

        Ok updatedModel ->
            case PubGrubCore.pickPackage updatedModel.partialSolution of
                Nothing ->
                    case PartialSolution.solution updatedModel.partialSolution of
                        Just solution ->
                            ( Finished (Ok solution), NoEffect )

                        Nothing ->
                            ( Finished (Err "How did we end up with no package to choose but no solution?"), NoEffect )

                Just packageAndTerm ->
                    ( Solving root updatedModel, ListVersions packageAndTerm )


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


updateUntilFinished : PackagesConfig -> ( Model, Effect ) -> Result String Solution
updateUntilFinished config ( model, effect ) =
    case model of
        Solving _ _ ->
            updateUntilFinished config (updateEffect (performSync config effect) model)

        Finished finished ->
            finished


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



-- ASYNC #############################################################


init : Cache -> String -> Version -> ( Model, Effect )
init cache root version =
    -- TODO: use cache
    solveRec root root (PubGrubCore.init root version)


update : Cache -> Msg -> Model -> ( Model, Effect )
update cache msg model =
    -- TODO: use cache
    updateEffect msg model



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
