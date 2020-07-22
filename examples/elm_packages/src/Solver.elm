module Solver exposing (Config, State(..), Strategy(..), defaultConfig, initCache, solve, solvePackage, update)

import API
import Dict
import Elm.Version
import ElmPackages
import Project exposing (Project)
import PubGrub
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)


type State
    = Finished (Result String PubGrub.Solution)
    | Solving PubGrub.State


type alias Config =
    { online : Bool
    , strategy : Strategy
    }


type Strategy
    = Newest
    | Oldest


defaultConfig : Config
defaultConfig =
    { online = False
    , strategy = Newest
    }


initCache : Cache
initCache =
    Dict.foldl insertVersions Cache.empty ElmPackages.allPackages


insertVersions : String -> List Elm.Version.Version -> Cache -> Cache
insertVersions package versions cache =
    List.map (Elm.Version.toTuple >> Version.fromTuple) versions
        |> List.map (\v -> ( package, v ))
        |> (\l -> Cache.addPackageVersions l cache)


solvePackage : String -> Version -> Config -> Cache -> ( State, Cmd API.Msg )
solvePackage root rootVersion { online, strategy } cache =
    if online then
        PubGrub.init cache root rootVersion
            |> updateHelper cache

    else
        ( PubGrub.solve (PubGrub.packagesConfigFromCache cache) root rootVersion
            |> Finished
        , Cmd.none
        )


updateHelper : Cache -> ( PubGrub.State, PubGrub.Effect ) -> ( State, Cmd API.Msg )
updateHelper cache ( pgState, effect ) =
    case effect of
        PubGrub.NoEffect ->
            ( Solving pgState, Cmd.none )

        -- TODO: only update the list of packages and versions once at startup
        PubGrub.ListVersions ( package, term ) ->
            let
                versions =
                    Cache.listVersions cache package

                msg =
                    PubGrub.AvailableVersions package term versions
            in
            PubGrub.update cache msg pgState
                |> updateHelper cache

        PubGrub.RetrieveDependencies ( package, version ) ->
            ( Solving pgState, API.getDependencies package version )

        PubGrub.SignalEnd result ->
            ( Finished result, Cmd.none )


update : API.Msg -> State -> ( State, Cmd API.Msg )
update msg state =
    case msg of
        API.GotDeps (Ok content) ->
            -- TODO: change this (this is for debug)
            ( Finished (Err content), Cmd.none )

        API.GotDeps (Err httpError) ->
            ( Finished (Err <| Debug.toString httpError), Cmd.none )


solve : Project -> Config -> Cache -> ( State, Cmd msg )
solve project { online, strategy } cache =
    case project of
        Project.Package package version dependencies ->
            if online then
                Debug.todo "TODO"

            else
                -- TODO: take into account that the root package
                -- may have updated dependencies compared
                -- to one that may already be in cache
                -- (in case working on that package)
                ( PubGrub.solve (configFrom cache package version dependencies) package version
                    |> Finished
                , Cmd.none
                )

        Project.Application dependencies ->
            if online then
                Debug.todo "TODO"

            else
                ( PubGrub.solve (configFrom cache "root" Version.one dependencies) "root" Version.one
                    |> Finished
                , Cmd.none
                )


configFrom : Cache -> String -> Version -> List ( String, Range ) -> PubGrub.PackagesConfig
configFrom cache rootPackage rootVersion dependencies =
    { listAvailableVersions =
        \package ->
            if package == rootPackage then
                [ rootVersion ]

            else
                Cache.listVersions cache package
    , getDependencies =
        \package version ->
            if package == rootPackage && version == rootVersion then
                Just dependencies

            else
                Cache.listDependencies cache package version
    }
