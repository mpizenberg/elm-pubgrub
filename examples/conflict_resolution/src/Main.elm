module Main exposing (main)

import Browser
import Html exposing (Html)
import Html.Events exposing (onClick)
import PubGrub
import Range exposing (Range)
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
    = Init PubGrub.Connectivity
    | Solving ( PubGrub.State, PubGrub.Effect )
    | Solved (Result String PubGrub.Solution)


type Msg
    = SwitchConnectivity
    | Solve
    | Simulate


init : () -> ( Model, Cmd Msg )
init _ =
    ( Init PubGrub.Online, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( SwitchConnectivity, Init connectivity ) ->
            if connectivity == PubGrub.Online then
                ( Init PubGrub.Offline, Cmd.none )

            else
                ( Init PubGrub.Online, Cmd.none )

        ( Solve, Init connectivity ) ->
            let
                actualCache =
                    if connectivity == PubGrub.Offline then
                        cache

                    else
                        PubGrub.emptyCache

                ( state, effect ) =
                    PubGrub.init connectivity actualCache "root" Version.one
            in
            case effect of
                PubGrub.SignalEnd result ->
                    ( Solved result, Cmd.none )

                _ ->
                    ( Solving ( state, effect ), Cmd.none )

        ( Simulate, Solving ( state, effect ) ) ->
            case effect of
                PubGrub.ListVersions ( package, term ) ->
                    let
                        versions =
                            simulateListVersions package

                        pgMsg =
                            PubGrub.AvailableVersions package term versions

                        newStateAndEffect =
                            PubGrub.update PubGrub.Online PubGrub.emptyCache pgMsg state
                    in
                    ( Solving newStateAndEffect, Cmd.none )

                PubGrub.RetrieveDependencies ( package, version ) ->
                    let
                        dependencies =
                            simulateRetrieveDependencies package version

                        pgMsg =
                            PubGrub.PackageDependencies package version dependencies

                        newStateAndEffect =
                            PubGrub.update PubGrub.Online PubGrub.emptyCache pgMsg state
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


cache : PubGrub.Cache
cache =
    PubGrub.emptyCache
        |> PubGrub.cachePackageVersions
            [ ( "root", Version.one )
            , ( "foo", Version.one )
            , ( "foo", Version.two )
            , ( "bar", Version.one )
            ]
        |> PubGrub.cacheDependencies "root" Version.one [ ( "foo", Range.higherThan Version.one ) ]
        |> PubGrub.cacheDependencies "foo" Version.two [ ( "bar", Range.between Version.one Version.two ) ]
        |> PubGrub.cacheDependencies "foo" Version.one []
        |> PubGrub.cacheDependencies "bar" Version.one [ ( "foo", Range.between Version.one Version.two ) ]


simulateListVersions : String -> List Version
simulateListVersions package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one, Version.two ]
                |> List.reverse

        "bar" ->
            [ Version.one ]

        _ ->
            []


simulateRetrieveDependencies : String -> Version -> Maybe (List ( String, Range ))
simulateRetrieveDependencies package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.higherThan Version.one ) ]

        ( "foo", ( 2, 0, 0 ) ) ->
            Just [ ( "bar", Range.between Version.one Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.between Version.one Version.two ) ]

        _ ->
            Nothing



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
