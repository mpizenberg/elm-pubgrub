module Database.Stub exposing (getDependencies, listAvailableVersions)

import Range exposing (Range)
import Version exposing (Version)


getDependencies : String -> Version -> Maybe (List ( String, Range ))
getDependencies =
    getDependencies1


listAvailableVersions : String -> List Version
listAvailableVersions =
    listAvailableVersions1



-- Example 1: no conflict
-- https://github.com/dart-lang/pub/blob/master/doc/solver.md#no-conflicts


getDependencies1 package version =
    case ( package, Version.toTuple version ) of
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
