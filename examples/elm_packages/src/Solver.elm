port module Solver exposing
    ( Config
    , State(..)
    , Strategy(..)
    , defaultConfig
    , initCache
    , solve
    , solvePackage
    , update
    )

import API
import Dict
import Elm.Version
import ElmPackages
import Json.Encode exposing (Value)
import Project exposing (Project)
import PubGrub
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)


port saveDependencies : Value -> Cmd msg


{-| State of the solver.

The Finished variant indicates that the solver has ended,
either with a successfull list of dependencies (PubGrub.Solution)
or with an error message.

The Solving and ProjectSolving variants serve the same role.
The first one (Solving) is used for existing packages entered in the form input.
The second one (ProjectSolving) is used when an elm.json file was loaded.

The main difference between the two is that in the case of a project elm.json
(package or application) the dependencies are directly provided in the elm.json.

-}
type State
    = Finished (Result String PubGrub.Solution)
    | Solving Strategy PubGrub.State PubGrub.Effect
    | ProjectSolving Strategy String Version (List ( String, Range )) PubGrub.State PubGrub.Effect


type alias Config =
    { online : Bool
    , strategy : Strategy
    }


{-| The "Newest" strategy consists in picking the newest package possible
satisfying the dependency constraints,
while the "Oldest" strategy does the reverse.
-}
type Strategy
    = Newest
    | Oldest



-- Initialization ####################################################


defaultConfig : Config
defaultConfig =
    { online = False
    , strategy = Newest
    }


{-| Put all preloaded packages into the cache for initialization.
-}
initCache : Cache
initCache =
    Dict.foldl insertVersions Cache.empty ElmPackages.allPackages


insertVersions : String -> List Elm.Version.Version -> Cache -> Cache
insertVersions package versions cache =
    List.map (Elm.Version.toTuple >> Version.fromTuple) versions
        |> List.map (\v -> ( package, v ))
        |> (\l -> Cache.addPackageVersions l cache)



-- Published Package #################################################
--
-- This section deals with the case when a package was entered in the form input.


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
--
-- This section deals with the case when an elm.json file was loaded.


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


{-| Update the solver state when a new message arrives
(dependencies of a packages have been downloaded).
-}
update : (API.Msg -> msg) -> Cache -> API.Msg -> State -> ( Cache, State, Cmd msg )
update toMsg cache msg state =
    case ( msg, state ) of
        -- This branch (state = Solving ...) is used when a package was entered in the input form.
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

                ( newPgState, newCmd ) =
                    PubGrub.update newCache pgMsg pgState
                        |> updateHelper newCache strategy

                depsValue =
                    Json.Encode.object
                        [ ( "key", encodePackageVersion ( package, version ) )
                        , ( "value", Json.Encode.list encodeDependency dependencies )
                        ]
            in
            ( newCache, newPgState, Cmd.batch [ Cmd.map toMsg newCmd, saveDependencies depsValue ] )

        -- This branch (state = ProjectSolving ...) is used when an elm.json file was loaded.
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

                ( newPgState, newCmd ) =
                    PubGrub.update newCache pgMsg pgState
                        |> projectUpdateHelper newCache strategy root rootVersion rootDependencies

                depsValue =
                    Json.Encode.object
                        [ ( "key", encodePackageVersion ( package, version ) )
                        , ( "value", Json.Encode.list encodeDependency dependencies )
                        ]
            in
            ( newCache, newPgState, Cmd.batch [ Cmd.map toMsg newCmd, saveDependencies depsValue ] )

        -- Terminate if an error occurred.
        ( API.GotDeps _ _ (Err httpError), Solving _ _ _ ) ->
            ( cache, Finished (Err <| Debug.toString httpError), Cmd.none )

        ( API.GotDeps _ _ (Err httpError), ProjectSolving _ _ _ _ _ _ ) ->
            ( cache, Finished (Err <| Debug.toString httpError), Cmd.none )

        _ ->
            ( cache, state, Cmd.none )


{-| Encode a package and a version into a JavaScript string
of the form: "package@1.0.0"
-}
encodePackageVersion : ( String, Version ) -> Value
encodePackageVersion ( package, version ) =
    (package ++ "@" ++ Version.toDebugString version)
        |> Json.Encode.string


{-| Encode a dependency into a JavaScript string
of the form: "package@1.0.0 <= v < 2.0.0"
-}
encodeDependency : ( String, Range ) -> Value
encodeDependency ( package, range ) =
    (package ++ "@" ++ Range.toDebugString range)
        |> Json.Encode.string


{-| Build a package configuration for the "Offline" mode (solving synchronously).

Use the dependencies provided as argument if the solver asks for the dependency
of the package and version also given as arguments here.

Use the cache otherwise.

-}
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


{-| Depending on the strategy (Oldest or Newest),
sort the versions in increasing or decreasing order.
-}
sortStrategy : Strategy -> List Version -> List Version
sortStrategy strategy versions =
    case strategy of
        Oldest ->
            List.sortBy Version.toTuple versions

        Newest ->
            List.sortBy Version.toTuple versions
                |> List.reverse
