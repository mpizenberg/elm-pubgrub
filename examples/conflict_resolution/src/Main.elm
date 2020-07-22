module Main exposing (main)

import Browser
import Cache exposing (Cache)
import Html exposing (Html)
import Html.Events exposing (onClick)
import PubGrub
import Range
import Version exposing (Version)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        }


type Model
    = Init Connectivity
    | Solving ( PubGrub.State, PubGrub.Effect )
    | Solved (Result String PubGrub.Solution)


type Connectivity
    = Offline
    | Online


type Msg
    = SwitchConnectivity
    | Solve
    | Simulate


init : () -> ( Model, Cmd Msg )
init _ =
    ( Init Online, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( SwitchConnectivity, Init connectivity ) ->
            ( Init connectivity, Cmd.none )

        ( Solve, Init connectivity ) ->
            case connectivity of
                Offline ->
                    ( PubGrub.solve (PubGrub.packagesConfigFromCache cache) "root" Version.one
                        |> Solved
                    , Cmd.none
                    )

                Online ->
                    case PubGrub.init Cache.empty "root" Version.one of
                        ( _, PubGrub.SignalEnd result ) ->
                            ( Solved result, Cmd.none )

                        stateAndEffect ->
                            ( Solving stateAndEffect, Cmd.none )

        ( Simulate, Solving ( state, effect ) ) ->
            case effect of
                PubGrub.ListVersions ( package, term ) ->
                    let
                        versions =
                            Cache.listVersions cache package

                        pgMsg =
                            PubGrub.AvailableVersions package term versions

                        newStateAndEffect =
                            PubGrub.update Cache.empty pgMsg state
                    in
                    ( Solving newStateAndEffect, Cmd.none )

                PubGrub.RetrieveDependencies ( package, version ) ->
                    let
                        dependencies =
                            Cache.listDependencies cache package version

                        pgMsg =
                            PubGrub.PackageDependencies package version dependencies

                        newStateAndEffect =
                            PubGrub.update Cache.empty pgMsg state
                    in
                    ( Solving newStateAndEffect, Cmd.none )

                PubGrub.SignalEnd result ->
                    ( Solved result, Cmd.none )

                _ ->
                    ( Solving ( state, effect ), Cmd.none )

        _ ->
            ( model, Cmd.none )



-- Cache and network simulation
-- Example performing conflict resolution
-- https://github.com/dart-lang/pub/blob/master/doc/solver.md#performing-conflict-resolution


cache : Cache
cache =
    Cache.empty
        |> Cache.addPackageVersions
            [ ( "root", Version.one )
            , ( "foo", Version.one )
            , ( "foo", Version.two )
            , ( "bar", Version.one )
            ]
        |> Cache.addDependencies "root" Version.one [ ( "foo", Range.higherThan Version.one ) ]
        |> Cache.addDependencies "foo" Version.two [ ( "bar", Range.between Version.one Version.two ) ]
        |> Cache.addDependencies "foo" Version.one []
        |> Cache.addDependencies "bar" Version.one [ ( "foo", Range.between Version.one Version.two ) ]



-- View


dependenciesString : String
dependenciesString =
    """
System we are trying to solve:
https://github.com/dart-lang/pub/blob/master/doc/solver.md#performing-conflict-resolution

root 1.0.0 depends on foo >=1.0.0
foo 2.0.0 depends on bar ^1.0.0
foo 1.0.0 has no dependencies
bar 1.0.0 depends on foo ^1.0.0
"""


view : Model -> Html Msg
view model =
    case model of
        Init connectivity ->
            Html.p []
                [ Html.text ("Current mode: " ++ Debug.toString connectivity)
                , Html.button [ onClick SwitchConnectivity ] [ Html.text "Switch Connectivity" ]
                , Html.button [ onClick Solve ] [ Html.text "Solve" ]
                , Html.pre [] [ Html.text dependenciesString ]
                ]

        Solving ( state, effect ) ->
            Html.p []
                [ Html.pre [] [ Html.text dependenciesString ]
                , Html.text "Solving ..."
                , Html.button [ onClick Simulate ] [ Html.text "Simulate Network Request" ]
                , Html.br [] []
                , Html.pre [] [ Html.text ("Current effect required:\n" ++ PubGrub.effectToString effect) ]
                , Html.br [] []
                , Html.pre [] [ Html.text ("Current internal state:\n" ++ PubGrub.stateToString state) ]
                ]

        Solved (Ok solution) ->
            Html.p []
                [ Html.pre [] [ Html.text dependenciesString ]
                , Html.pre [] [ Html.text ("Solution:\n\n" ++ solutionString solution) ]
                ]

        Solved (Err err) ->
            Html.p []
                [ Html.pre [] [ Html.text dependenciesString ]
                , Html.pre [] [ Html.text ("Something went wrong ...\n" ++ err) ]
                ]


solutionString : List ( String, Version ) -> String
solutionString solution =
    List.map (\( package, version ) -> package ++ " " ++ Version.toDebugString version) solution
        |> String.join ", "
