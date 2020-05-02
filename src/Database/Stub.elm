module Database.Stub exposing (getDependencies, listAvailableVersions)

import Range exposing (Range)
import Version exposing (Version)


getDependencies : String -> Version -> Maybe (List ( String, Range ))
getDependencies =
    getDependencies3


listAvailableVersions : String -> List Version
listAvailableVersions =
    listAvailableVersions3



-- Example 1: no conflict
-- https://github.com/dart-lang/pub/blob/master/doc/solver.md#no-conflicts


getDependencies1 package version =
    case Debug.log "getDependencies of package" ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.Between Version.one Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just [ ( "bar", Range.Between Version.one Version.two ) ]

        ( "bar", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 2, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


listAvailableVersions1 package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one ]

        "bar" ->
            [ Version.one, Version.two ]

        _ ->
            []



-- Example 2: avoiding conflict during decision making
-- https://github.com/dart-lang/pub/blob/master/doc/solver.md#avoiding-conflict-during-decision-making


listAvailableVersions2 package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one, Version.new_ 1 1 0 ]
                |> List.reverse

        "bar" ->
            [ Version.one, Version.new_ 1 1 0, Version.two ]
                |> List.reverse

        _ ->
            []


getDependencies2 package version =
    case Debug.log "getDependencies of package" ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just
                [ ( "foo", Range.Between Version.one Version.two )
                , ( "bar", Range.Between Version.one Version.two )
                ]

        ( "foo", ( 1, 1, 0 ) ) ->
            Just [ ( "bar", Range.Between Version.two Version.three ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 1, 1, 0 ) ) ->
            Just []

        ( "bar", ( 2, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing



-- Example 3: performing conflict resolution
-- https://github.com/dart-lang/pub/blob/master/doc/solver.md#performing-conflict-resolution


listAvailableVersions3 package =
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


getDependencies3 package version =
    case Debug.log "getDependencies of package" ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.HigherThan Version.one ) ]

        ( "foo", ( 2, 0, 0 ) ) ->
            Just [ ( "bar", Range.Between Version.one Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.Between Version.one Version.two ) ]

        _ ->
            Nothing
