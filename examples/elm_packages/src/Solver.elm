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
    | Solving PubGrub.State PubGrub.Effect


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
            ( Solving pgState effect, Cmd.none )

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
            ( Solving pgState effect, API.getDependencies package version )

        PubGrub.SignalEnd result ->
            ( Finished result, Cmd.none )


update : Cache -> API.Msg -> State -> ( Cache, State, Cmd API.Msg )
update cache msg state =
    case ( msg, state ) of
        ( API.GotDeps package version (Ok elmProject), Solving pgState _ ) ->
            let
                dependencies =
                    case Project.fromElmProject elmProject of
                        Project.Package _ _ deps ->
                            deps

                        Project.Application deps ->
                            deps

                newCache =
                    Cache.addDependencies package version dependencies cache

                pgMsg =
                    PubGrub.PackageDependencies package version (Just dependencies)

                ( newPgState, effect ) =
                    PubGrub.update newCache pgMsg pgState
                        |> updateHelper newCache
            in
            ( newCache, newPgState, effect )

        ( API.GotDeps _ _ (Err httpError), Solving _ _ ) ->
            ( cache, Finished (Err <| Debug.toString httpError), Cmd.none )

        _ ->
            ( cache, state, Cmd.none )


solve : Project -> Config -> Cache -> ( State, Cmd API.Msg )
solve project { online, strategy } cache =
    case project of
        -- TODO: take into account that the root package
        -- may have updated dependencies compared
        -- to one that may already be in cache
        -- (in case working on that package)
        Project.Package package version dependencies ->
            if online then
                -- TODO: take into account the fact that we know
                -- direct dependencies of package@version already,
                -- but without corrupting the cache?
                PubGrub.init cache package version
                    |> updateHelper cache

            else
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
