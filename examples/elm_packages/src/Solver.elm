module Solver exposing (Config, State(..), Strategy(..), defaultConfig, initCache, solve, solvePackage, update)

import API
import Dict
import Elm.Version
import ElmPackages
import Project exposing (Project)
import PubGrub
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Range exposing (Range)
import PubGrub.Version as Version exposing (Version)


type State
    = Finished (Result String PubGrub.Solution)
    | Solving Strategy PubGrub.State PubGrub.Effect
    | ProjectSolving Strategy String Version (List ( String, Range )) PubGrub.State PubGrub.Effect


type alias Config =
    { online : Bool
    , strategy : Strategy
    }


type Strategy
    = Newest
    | Oldest



-- Initialization ####################################################


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



-- Published Package #################################################


solvePackage : String -> Version -> Config -> Cache -> ( State, Cmd API.Msg )
solvePackage root rootVersion { online, strategy } cache =
    if online then
        PubGrub.init cache root rootVersion
            |> updateHelper cache strategy

    else
        ( PubGrub.solve (configFrom cache strategy "" Version.zero []) root rootVersion
            |> Finished
        , Cmd.none
        )


updateHelper : Cache -> Strategy -> ( PubGrub.State, PubGrub.Effect ) -> ( State, Cmd API.Msg )
updateHelper cache strategy ( pgState, effect ) =
    case effect of
        PubGrub.NoEffect ->
            ( Solving strategy pgState effect
            , Cmd.none
            )

        -- TODO: only update the list of packages and versions once at startup
        PubGrub.ListVersions ( package, term ) ->
            let
                versions =
                    Cache.listVersions cache package
                        |> sortStrategy strategy

                msg =
                    PubGrub.AvailableVersions package term versions
            in
            PubGrub.update cache msg pgState
                |> updateHelper cache strategy

        PubGrub.RetrieveDependencies ( package, version ) ->
            ( Solving strategy pgState effect
            , API.getDependencies package version
            )

        PubGrub.SignalEnd result ->
            ( Finished result, Cmd.none )



-- Project elm.json ##################################################


solve : Project -> Config -> Cache -> ( State, Cmd API.Msg )
solve project { online, strategy } cache =
    case project of
        -- TODO: take into account that the root package dependencies (elm.json)
        -- may conflict with an existing published package.
        -- Maybe we should add an incompatibility forbidding all versions of that package
        -- (preventing cyclic dependencies)
        Project.Package package version dependencies ->
            if online then
                PubGrub.init cache package version
                    |> projectUpdateHelper cache strategy package version dependencies

            else
                ( PubGrub.solve (configFrom cache strategy package version dependencies) package version
                    |> Finished
                , Cmd.none
                )

        Project.Application dependencies ->
            if online then
                PubGrub.init cache "root" Version.one
                    |> projectUpdateHelper cache strategy "root" Version.one dependencies

            else
                ( PubGrub.solve (configFrom cache strategy "root" Version.one dependencies) "root" Version.one
                    |> Finished
                , Cmd.none
                )


projectUpdateHelper : Cache -> Strategy -> String -> Version -> List ( String, Range ) -> ( PubGrub.State, PubGrub.Effect ) -> ( State, Cmd API.Msg )
projectUpdateHelper cache strategy root rootVersion dependencies ( pgState, effect ) =
    case effect of
        PubGrub.NoEffect ->
            ( ProjectSolving strategy root rootVersion dependencies pgState effect
            , Cmd.none
            )

        PubGrub.ListVersions ( package, term ) ->
            let
                versions =
                    if package == root then
                        [ rootVersion ]

                    else
                        Cache.listVersions cache package
                            |> sortStrategy strategy

                msg =
                    PubGrub.AvailableVersions package term versions
            in
            PubGrub.update cache msg pgState
                |> projectUpdateHelper cache strategy root rootVersion dependencies

        PubGrub.RetrieveDependencies ( package, version ) ->
            if package == root && version == rootVersion then
                let
                    msg =
                        PubGrub.PackageDependencies root rootVersion (Just dependencies)
                in
                PubGrub.update cache msg pgState
                    |> projectUpdateHelper cache strategy root rootVersion dependencies

            else
                ( ProjectSolving strategy root rootVersion dependencies pgState effect
                , API.getDependencies package version
                )

        PubGrub.SignalEnd result ->
            ( Finished result, Cmd.none )



-- Common to published and elm.json ##################################


update : Cache -> API.Msg -> State -> ( Cache, State, Cmd API.Msg )
update cache msg state =
    case ( msg, state ) of
        ( API.GotDeps package version (Ok elmProject), Solving strategy pgState _ ) ->
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
                        |> updateHelper newCache strategy
            in
            ( newCache, newPgState, effect )

        ( API.GotDeps package version (Ok elmProject), ProjectSolving strategy root rootVersion rootDependencies pgState _ ) ->
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
                        |> projectUpdateHelper newCache strategy root rootVersion rootDependencies
            in
            ( newCache, newPgState, effect )

        ( API.GotDeps _ _ (Err httpError), Solving _ _ _ ) ->
            ( cache, Finished (Err <| Debug.toString httpError), Cmd.none )

        ( API.GotDeps _ _ (Err httpError), ProjectSolving _ _ _ _ _ _ ) ->
            ( cache, Finished (Err <| Debug.toString httpError), Cmd.none )

        _ ->
            ( cache, state, Cmd.none )


configFrom : Cache -> Strategy -> String -> Version -> List ( String, Range ) -> PubGrub.PackagesConfig
configFrom cache strategy rootPackage rootVersion dependencies =
    { listAvailableVersions =
        \package ->
            if package == rootPackage then
                [ rootVersion ]

            else
                Cache.listVersions cache package
                    |> sortStrategy strategy
    , getDependencies =
        \package version ->
            if package == rootPackage && version == rootVersion then
                Just dependencies

            else
                Cache.listDependencies cache package version
    }


sortStrategy : Strategy -> List Version -> List Version
sortStrategy strategy versions =
    case strategy of
        Oldest ->
            List.sortBy Version.toTuple versions

        Newest ->
            List.sortBy Version.toTuple versions
                |> List.reverse
