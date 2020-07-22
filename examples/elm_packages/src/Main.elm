module Main exposing (main)

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
import Json.Decode
import Project exposing (Project)
import PubGrub.Cache exposing (Cache)
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)
import Solver
import Task
import Widget
import Widget.Style
import Widget.Style.Material as Material


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        }



-- TODO: Add the Elm version to the dependencies (0.19 etc)


type alias Model =
    { cache : Cache
    , state : State
    }


type State
    = Init String (Maybe ( String, Version ))
    | LoadedProject Project Solver.Config
    | PickedPackage String Version Solver.Config
    | Error String
    | Solution (List ( String, Version ))


type Msg
    = NoMsg
    | BackHome
    | LoadElmJson
    | ElmJsonFile File
    | ElmJsonContent String
    | Input String
    | PickPackage ( String, Version )
    | SwitchConnectivity
    | SwitchStrategy Solver.Strategy
    | Solve


init : () -> ( Model, Cmd Msg )
init _ =
    -- ( PickedPackage "mpizenberg/elm-pointer-events" Version.one defaultConfig, Cmd.none )
    ( Model Solver.initCache (Init "" Nothing), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.state ) of
        ( BackHome, _ ) ->
            init ()

        -- elm.json
        ( LoadElmJson, Init _ _ ) ->
            ( { model | state = Init "" Nothing }
            , File.Select.file [ "application/json" ] ElmJsonFile
            )

        ( ElmJsonFile file, Init _ _ ) ->
            ( { model | state = Init "" Nothing }
            , Task.perform ElmJsonContent (File.toString file)
            )

        ( ElmJsonContent content, Init _ _ ) ->
            case Json.Decode.decodeString Elm.Project.decoder content of
                Ok elmProject ->
                    ( { model | state = LoadedProject (Project.fromElmProject elmProject) Solver.defaultConfig }
                    , Cmd.none
                    )

                Err err ->
                    ( { model | state = Error (Json.Decode.errorToString err) }, Cmd.none )

        ( SwitchConnectivity, LoadedProject p config ) ->
            ( { model | state = LoadedProject p { config | online = not config.online } }
            , Cmd.none
            )

        ( SwitchStrategy strategy, LoadedProject p config ) ->
            ( { model | state = LoadedProject p { config | strategy = strategy } }
            , Cmd.none
            )

        ( Solve, LoadedProject project config ) ->
            case Solver.solve project config model.cache of
                ( Solver.Finished (Ok solution), cmd ) ->
                    ( { model | state = Solution solution }, cmd )

                ( Solver.Finished (Err error), cmd ) ->
                    ( { model | state = Error error }, cmd )

        -- Packages
        ( Input input, Init _ _ ) ->
            let
                maybePackage =
                    ElmPackages.packageVersionFromString input
                        |> Result.toMaybe
                        |> Maybe.map (Tuple.mapSecond (Version.fromTuple << Elm.Version.toTuple))
            in
            ( { model | state = Init input maybePackage }, Cmd.none )

        ( PickPackage ( package, version ), Init _ _ ) ->
            ( { model | state = PickedPackage package version Solver.defaultConfig }, Cmd.none )

        ( SwitchConnectivity, PickedPackage p v config ) ->
            ( { model | state = PickedPackage p v { config | online = not config.online } }, Cmd.none )

        ( SwitchStrategy strategy, PickedPackage p v config ) ->
            ( { model | state = PickedPackage p v { config | strategy = strategy } }, Cmd.none )

        ( Solve, PickedPackage package version config ) ->
            ( Debug.todo "TODO", Cmd.none )

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
            viewInit inputText maybePackage

        PickedPackage package version config ->
            viewPicked config package version

        LoadedProject project config ->
            viewProject config project

        Error error ->
            viewError error

        Solution solution ->
            viewSolution solution



-- Init


viewInit : String -> Maybe ( String, Version ) -> Element Msg
viewInit inputText maybePackage =
    Element.column [ Element.centerX, Element.spacing 20 ]
        [ Widget.textButton (Material.outlinedButton Material.defaultPalette)
            { onPress = Just LoadElmJson
            , text = "Load elm.json"
            }
            |> Element.el [ Element.centerX ]
        , Element.text "Or try an existing package ↓"
        , Element.row [ Element.spacing 20 ]
            [ Element.Input.text []
                { onChange = Input
                , text = inputText
                , placeholder = Just (Element.Input.placeholder [] (Element.text "toto@1.0.0"))
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


viewPicked : Solver.Config -> String -> Version -> Element Msg
viewPicked config package version =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ Element.row [ Element.width Element.fill ]
            [ backToHomeButton, filler, cacheInfo ]
        , Element.paragraph [ Element.Font.size 24 ]
            [ Element.text "Selected "
            , Element.el [ Element.Font.bold ] (Element.text package)
            , Element.text " at version "
            , Element.el [ Element.Font.bold ] (Element.text <| Version.toDebugString version)
            ]
        , viewConfig config
        , solveButton
        ]


cacheInfo : Element msg
cacheInfo =
    Element.el [ Element.Font.size 12 ] (Element.text "Cached entries: ")


filler : Element msg
filler =
    Element.el [ Element.width Element.fill ] Element.none


backToHomeButton : Element Msg
backToHomeButton =
    Widget.textButton (Material.textButton Material.defaultPalette)
        { onPress = Just BackHome
        , text = "↩  Home"
        }


solveButton : Element Msg
solveButton =
    Widget.textButton (Material.containedButton Material.defaultPalette)
        { onPress = Just Solve
        , text = "Solve"
        }
        |> Element.el [ Element.centerX ]


viewConfig : Solver.Config -> Element Msg
viewConfig { online, strategy } =
    Element.row [ Element.spacing 20 ]
        [ Element.text "Connectivity:"
        , viewConnectivity online
        , Element.text "Version strategy:"
        , viewStrategy strategy
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
            always (Just SwitchConnectivity)
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



-- Project


viewProject : Solver.Config -> Project -> Element Msg
viewProject config project =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ Element.row [ Element.width Element.fill ]
            [ backToHomeButton, filler, cacheInfo ]
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
        [ Element.el [ Element.Font.size 20 ] (Element.text "Project dependencies:")
        , Element.el [ Element.padding 20 ] <|
            if List.isEmpty dependencies then
                Element.text "No dependencies"

            else
                Widget.column Material.column (List.map viewDependency dependencies)
        ]


viewDependency : ( String, Range ) -> Element msg
viewDependency ( package, range ) =
    Element.text (package ++ " " ++ Range.toDebugString range)



-- Error


viewError : String -> Element Msg
viewError error =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ Element.row [ Element.width Element.fill ]
            [ backToHomeButton, filler, cacheInfo ]
        , Element.paragraph [ Element.Font.size 24 ]
            [ Element.text "Something went wrong!" ]
        , Element.paragraph [ Element.Font.family [ Element.Font.monospace ] ]
            [ Element.text error ]
        ]



-- Solution


viewSolution : List ( String, Version ) -> Element Msg
viewSolution solution =
    Element.column
        [ Element.centerX
        , Element.spacing 20
        , Element.width Element.shrink
        ]
        [ Element.row [ Element.width Element.fill ]
            [ backToHomeButton, filler, cacheInfo ]
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
