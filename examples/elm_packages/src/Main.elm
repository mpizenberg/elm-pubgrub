module Main exposing (main)

import API
import Browser
import Element exposing (Element)
import Element.Font
import Element.Input
import Elm.Project
import Elm.Version
import ElmPackages
import File exposing (File)
import File.Select
import Html exposing (Html)
import Json.Decode exposing (Value)
import Project exposing (Project)
import PubGrub
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)
import Solver
import Task
import Widget
import Widget.Style
import Widget.Style.Material as Material


main : Program Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        }



-- TODO: Add the Elm version to the dependencies (0.19 etc)


type alias Model =
    -- Cache for the PubGrub algorithm
    { cache : Cache

    -- Current state of the application
    , state : State
    }


type State {- Init formInput maybePackage (maybePackage is the parsed form input) -}
    = Init String (Maybe ( String, Version ))
      -- LoadedProject state for when an elm.json has successfully been parsed
    | LoadedProject Project Solver.Config
      -- PickedPackage state when the package in the form input is validated
    | PickedPackage String Version Solver.Config
      -- Solving state is an intermediate state while solving with "Online" connectivity
    | Solving Solver.State
      -- If any error happens, use this state
    | Error String
      -- When the solver successfully obtained a list of dependencies
    | Solution (List ( String, Version ))


type Msg
    = NoMsg
      -- Return to home page
    | BackHome
      -- The "Load elm.json" button was clicked
    | LoadElmJson
      -- The elm.json file was loaded as a File
    | ElmJsonFile File
      -- The string content of the elm.json file was extracted
    | ElmJsonContent String
      -- The form input of the home page is being used
    | Input String
      -- Validate the choice of the package in the form input
    | PickPackage ( String, Version )
    | SwitchConnectivity Bool
    | SwitchStrategy Solver.Strategy
    | Solve
      -- Messages used by the solver
    | ApiMsg API.Msg


{-| Initialize the model.
The cache is preloaded with data from the `ElmPackages.elm` file
-}
init : Value -> ( Model, Cmd Msg )
init flags =
    let
        -- Let's first retrieve all package ids ("keys") in the dependencies store.
        keysStringDecoder =
            Json.Decode.field "keys"
                (Json.Decode.list Json.Decode.string)

        keysString : List String
        keysString =
            Json.Decode.decodeValue keysStringDecoder flags
                |> Result.withDefault []

        keys : List ( String, Version )
        keys =
            List.filterMap
                (ElmPackages.packageVersionFromString
                    >> Result.toMaybe
                    >> Maybe.map (Tuple.mapSecond Elm.Version.toTuple)
                    >> Maybe.map (Tuple.mapSecond Version.fromTuple)
                )
                keysString

        -- Now let's retrieve their associated dependencies.
        valuesStringDecoder =
            Json.Decode.field "values"
                (Json.Decode.list (Json.Decode.list Json.Decode.string))

        dependenciesString : List (List String)
        dependenciesString =
            Json.Decode.decodeValue valuesStringDecoder flags
                |> Result.withDefault []

        dependencies : List (List ( String, Range ))
        dependencies =
            List.map
                (List.filterMap (packageRangeFromString >> Result.toMaybe))
                dependenciesString

        -- Merge package keys and associated dependencies into one list.
        keysAndDeps =
            List.map2 Tuple.pair keys dependencies
    in
    ( { cache =
            List.foldl
                (\( ( package, version ), deps ) -> Cache.addDependencies package version deps)
                Solver.initCache
                keysAndDeps
      , state = initialState
      }
    , Cmd.none
    )


{-| Convert a string like "package@1.0.0 <= v < 2.0.0" into ( package, range ).
-}
packageRangeFromString : String -> Result String ( String, Range )
packageRangeFromString str =
    case String.split "@" str of
        package :: rangeStr :: [] ->
            Ok ( package, Project.rangeFromString rangeStr )

        _ ->
            Err ("Wrong package range format: " ++ str)


initialState : State
initialState =
    -- PickedPackage "elm/bytes" (Version.new_ 1 0 8) Solver.defaultConfig
    Init "" Nothing


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.state ) of
        ( BackHome, _ ) ->
            -- Keep cache, just restore initial state
            ( { model | state = initialState }, Cmd.none )

        -- elm.json
        -- The "Load elm.json" button was clicked
        ( LoadElmJson, Init _ _ ) ->
            ( { model | state = Init "" Nothing }
            , File.Select.file [ "application/json" ] ElmJsonFile
            )

        -- The elm.json file was loaded as a File
        ( ElmJsonFile file, Init _ _ ) ->
            ( { model | state = Init "" Nothing }
            , Task.perform ElmJsonContent (File.toString file)
            )

        -- The string content of the elm.json file was extracted
        ( ElmJsonContent content, Init _ _ ) ->
            case Json.Decode.decodeString Elm.Project.decoder content of
                Ok elmProject ->
                    ( { model | state = LoadedProject (Project.fromElmProject elmProject) Solver.defaultConfig }
                    , Cmd.none
                    )

                Err err ->
                    ( { model | state = Error (Json.Decode.errorToString err) }, Cmd.none )

        ( SwitchConnectivity online, LoadedProject p config ) ->
            ( { model | state = LoadedProject p { config | online = online } }
            , Cmd.none
            )

        ( SwitchStrategy strategy, LoadedProject p config ) ->
            ( { model | state = LoadedProject p { config | strategy = strategy } }
            , Cmd.none
            )

        ( Solve, LoadedProject project config ) ->
            case Solver.solve project config model.cache of
                ( Solver.Finished (Ok solution), cmd ) ->
                    ( { model | state = Solution solution }, Cmd.map ApiMsg cmd )

                ( Solver.Finished (Err error), cmd ) ->
                    ( { model | state = Error error }, Cmd.map ApiMsg cmd )

                ( solverState, cmd ) ->
                    ( { model | state = Solving solverState }, Cmd.map ApiMsg cmd )

        -- Packages
        -- The form input of the home page is being used
        ( Input input, Init _ _ ) ->
            let
                maybePackage =
                    ElmPackages.packageVersionFromString input
                        |> Result.toMaybe
                        |> Maybe.map (Tuple.mapSecond (Version.fromTuple << Elm.Version.toTuple))
            in
            ( { model | state = Init input maybePackage }, Cmd.none )

        -- Validate the choice of the package in the form input
        ( PickPackage ( package, version ), Init _ _ ) ->
            ( { model | state = PickedPackage package version Solver.defaultConfig }, Cmd.none )

        ( SwitchConnectivity online, PickedPackage p v config ) ->
            ( { model | state = PickedPackage p v { config | online = online } }, Cmd.none )

        ( SwitchStrategy strategy, PickedPackage p v config ) ->
            ( { model | state = PickedPackage p v { config | strategy = strategy } }, Cmd.none )

        ( Solve, PickedPackage package version config ) ->
            case Solver.solvePackage package version config model.cache of
                ( Solver.Finished (Ok solution), cmd ) ->
                    ( { model | state = Solution solution }, Cmd.map ApiMsg cmd )

                ( Solver.Finished (Err error), cmd ) ->
                    ( { model | state = Error error }, Cmd.map ApiMsg cmd )

                ( solverState, cmd ) ->
                    ( { model | state = Solving solverState }, Cmd.map ApiMsg cmd )

        -- Solving
        -- Messages used by the solver
        ( ApiMsg apiMsg, Solving solverState ) ->
            case Solver.update ApiMsg model.cache apiMsg solverState of
                ( newCache, Solver.Finished (Ok solution), cmd ) ->
                    ( { cache = newCache, state = Solution solution }, cmd )

                ( newCache, Solver.Finished (Err error), cmd ) ->
                    ( { cache = newCache, state = Error error }, cmd )

                ( newCache, newSolverState, cmd ) ->
                    ( { cache = newCache, state = Solving newSolverState }, cmd )

        _ ->
            ( model, Cmd.none )



-- View ##############################################################


view : Model -> Html Msg
view model =
    Element.layout [ Element.padding 20 ]
        (viewElement model)


viewElement : Model -> Element Msg
viewElement model =
    case model.state of
        Init inputText maybePackage ->
            viewInit model.cache inputText maybePackage

        PickedPackage package version config ->
            viewPicked model.cache config package version

        LoadedProject project config ->
            viewProject model.cache config project

        Solving solverState ->
            viewSolving model.cache solverState

        Error error ->
            viewError model.cache error

        Solution solution ->
            viewSolution model.cache solution



-- Init


viewInit : Cache -> String -> Maybe ( String, Version ) -> Element Msg
viewInit cache inputText maybePackage =
    Element.column [ Element.centerX, Element.spacing 20 ]
        [ viewTopBar cache
        , Widget.textButton (Material.outlinedButton Material.defaultPalette)
            { onPress = Just LoadElmJson
            , text = "Load elm.json"
            }
            |> Element.el [ Element.centerX ]
        , Element.text "Or try an existing package ↓"
        , Element.row [ Element.spacing 20 ]
            [ Element.Input.text []
                { onChange = Input
                , text = inputText
                , placeholder = Just (Element.Input.placeholder [] (Element.text "elm/bytes@1.0.8"))
                , label = Element.Input.labelLeft [] (Element.text "Package and version:")
                }
            , Widget.iconButton (Material.containedButton Material.defaultPalette)
                { onPress = Maybe.map PickPackage maybePackage
                , text = "Pick"
                , icon = Element.text "▶"
                }
            ]
        ]



-- Picked


viewPicked : Cache -> Solver.Config -> String -> Version -> Element Msg
viewPicked cache config package version =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ viewTopBar cache
        , Element.paragraph [ Element.Font.size 24 ]
            [ Element.text "Selected "
            , Element.el [ Element.Font.bold ] (Element.text package)
            , Element.text " at version "
            , Element.el [ Element.Font.bold ] (Element.text <| Version.toDebugString version)
            ]
        , viewConfig config
        , solveButton
        ]



-- Project


viewProject : Cache -> Solver.Config -> Project -> Element Msg
viewProject cache config project =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ viewTopBar cache
        , case project of
            Project.Package package version dependencies ->
                viewPackage package version dependencies

            Project.Application dependencies ->
                viewApplication dependencies
        , viewConfig config
        , solveButton
        ]


viewPackage : String -> Version -> List ( String, Range ) -> Element msg
viewPackage package version dependencies =
    Element.column []
        [ Element.el [ Element.Font.size 20 ]
            (Element.paragraph []
                [ Element.text "Dependencies of "
                , Element.el [ Element.Font.bold ] (Element.text package)
                , Element.text " at version "
                , Element.el [ Element.Font.bold ] (Element.text <| Version.toDebugString version)
                , Element.text ":"
                ]
            )
        , Element.el [ Element.padding 20 ] <|
            if List.isEmpty dependencies then
                Element.text "No dependencies"

            else
                Widget.column Material.column (List.map viewDependency dependencies)
        ]


viewApplication : List ( String, Range ) -> Element msg
viewApplication dependencies =
    Element.column []
        [ Element.el [ Element.Font.size 20 ] (Element.text "Project direct dependencies:")
        , Element.el [ Element.padding 20 ] <|
            if List.isEmpty dependencies then
                Element.text "No dependencies"

            else
                Widget.column Material.column (List.map viewDependency dependencies)
        ]


viewDependency : ( String, Range ) -> Element msg
viewDependency ( package, range ) =
    Element.text (package ++ " " ++ Range.toDebugString range)



-- Config


viewConfig : Solver.Config -> Element Msg
viewConfig { online, strategy } =
    Element.column [ Element.spacing 20 ]
        [ Element.row [ Element.spacing 20 ]
            [ Element.text "Connectivity:"
            , viewConnectivity online
            , Element.text "Version strategy:"
            , viewStrategy strategy
            ]
        , infoConnectivity online
        , infoStrategy strategy
        ]


infoConnectivity : Bool -> Element msg
infoConnectivity online =
    Element.paragraph []
        [ if online then
            Element.text "Online mode will make http requests to package.elm-lang.org, use with moderation, preferably on small dependency trees. Your cache will grow (see top right corner) if new information is downloaded. PS: cache should be kept in indexeddb on page reload."

          else
            Element.text "Offline mode will never make any http request. Solving will fail if a list of dependencies of some package is required but not available in cache. PS: cache should be kept in indexeddb on page reload."
        ]


infoStrategy : Solver.Strategy -> Element msg
infoStrategy strategy =
    Element.paragraph []
        [ case strategy of
            Solver.Newest ->
                Element.text "The \"Newest\" strategy consists in always picking the newest package that dependency constraints authorize"

            Solver.Oldest ->
                Element.text "The \"Oldest\" strategy consists in always picking the oldest package that dependency constraints authorize"
        ]


viewConnectivity : Bool -> Element Msg
viewConnectivity online =
    rowChoice
        { selected =
            if online then
                Just 1

            else
                Just 0
        , onSelect =
            \id ->
                if id == 0 then
                    Just (SwitchConnectivity False)

                else
                    Just (SwitchConnectivity True)
        , options =
            [ { text = "Offline", icon = Element.none }
            , { text = "Online", icon = Element.none }
            ]
        }


viewStrategy : Solver.Strategy -> Element Msg
viewStrategy strategy =
    rowChoice
        { selected =
            if strategy == Solver.Newest then
                Just 0

            else
                Just 1
        , onSelect =
            \id ->
                if id == 0 then
                    Just (SwitchStrategy Solver.Newest)

                else
                    Just (SwitchStrategy Solver.Oldest)
        , options =
            [ { text = "Newest", icon = Element.none }
            , { text = "Oldest", icon = Element.none }
            ]
        }


rowChoice : Widget.Select msg -> Element msg
rowChoice choices =
    Widget.select choices
        |> Widget.buttonRow
            { list =
                { materialButtonRow
                    | element = Element.width Element.shrink :: materialButtonRow.element
                }
            , button = Material.toggleButton Material.defaultPalette
            }


materialButtonRow : Widget.Style.RowStyle msg
materialButtonRow =
    Material.buttonRow



-- Solving


viewSolving : Cache -> Solver.State -> Element Msg
viewSolving cache solverState =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ viewTopBar cache
        , Element.paragraph [ Element.Font.size 24 ]
            [ Element.text "Solving ..." ]
        , Element.paragraph [ Element.padding 20 ]
            [ case solverState of
                Solver.Solving _ _ effect ->
                    Element.text ("Current effect being performed: " ++ PubGrub.effectToString effect)

                _ ->
                    Element.none
            ]
        ]



-- Error


viewError : Cache -> String -> Element Msg
viewError cache error =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ viewTopBar cache
        , Element.paragraph [ Element.Font.size 24 ]
            [ Element.text "Something went wrong!" ]
        , Element.column [ Element.spacing 20 ] <|
            List.map monospaced <|
                String.split "\n" error
        ]


monospaced : String -> Element msg
monospaced str =
    Element.paragraph [ Element.Font.family [ Element.Font.monospace ] ] [ Element.text str ]



-- Solution


viewSolution : Cache -> List ( String, Version ) -> Element Msg
viewSolution cache solution =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ viewTopBar cache
        , Element.column []
            [ Element.el [ Element.Font.size 20 ] (Element.text "Solution:")
            , Element.el [ Element.padding 20 ] <|
                if List.isEmpty solution then
                    Element.text "No dependencies"

                else
                    Widget.column Material.column (List.map viewVersion solution)
            ]
        ]


viewVersion : ( String, Version ) -> Element msg
viewVersion ( package, version ) =
    Element.text (package ++ " " ++ Version.toDebugString version)



-- Common


viewTopBar : Cache -> Element Msg
viewTopBar cache =
    Element.row [ Element.width Element.fill, Element.spacing 20 ]
        [ backToHomeButton, filler, historyInfo, filler, cacheInfo cache ]


historyInfo : Element msg
historyInfo =
    Element.el [ Element.Font.size 8 ]
        (Element.text "this demo only works for dependencies previous to 2020/07/22")


backToHomeButton : Element Msg
backToHomeButton =
    Widget.textButton (Material.textButton Material.defaultPalette)
        { onPress = Just BackHome
        , text = "↩  Home"
        }


filler : Element msg
filler =
    Element.el [ Element.width Element.fill ] Element.none


cacheInfo : Cache -> Element msg
cacheInfo cache =
    Element.el [ Element.Font.size 12 ]
        (Element.text ("Cached entries: " ++ String.fromInt (cacheSize cache)))


cacheSize : Cache -> Int
cacheSize cache =
    Cache.nbDependencies cache + Cache.nbPackageVersions cache


solveButton : Element Msg
solveButton =
    Widget.textButton (Material.containedButton Material.defaultPalette)
        { onPress = Just Solve
        , text = "Solve"
        }
        |> Element.el [ Element.centerX ]
