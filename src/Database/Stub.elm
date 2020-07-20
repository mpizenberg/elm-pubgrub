module Database.Stub exposing (getDependencies, listAvailableVersions)

{-| Examples dependencies for algorithm debugging purposes.
Those should eventually be moved into unit tests.

@docs getDependencies, listAvailableVersions

-}

import Range exposing (Range)
import Version exposing (Version)


{-| Get the list of dependencies of a given package at a given version.
-}
getDependencies : String -> Version -> Maybe (List ( String, Range ))
getDependencies =
    getDependencies6


{-| Get the list of available versions for a given package.
-}
listAvailableVersions : String -> List Version
listAvailableVersions =
    listAvailableVersions6


{-| Example 1: no conflict

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#no-conflicts>

-}
listAvailableVersions1 : String -> List Version
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


{-| -}
getDependencies1 : String -> Version -> Maybe (List ( String, Range ))
getDependencies1 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.between Version.one Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just [ ( "bar", Range.between Version.one Version.two ) ]

        ( "bar", ( 1, 0, 0 ) ) ->
            Just []

        ( "bar", ( 2, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


{-| Example 2: avoiding conflict during decision making

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#avoiding-conflict-during-decision-making>

-}
listAvailableVersions2 : String -> List Version
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


{-| -}
getDependencies2 : String -> Version -> Maybe (List ( String, Range ))
getDependencies2 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just
                [ ( "foo", Range.between Version.one Version.two )
                , ( "bar", Range.between Version.one Version.two )
                ]

        ( "foo", ( 1, 1, 0 ) ) ->
            Just [ ( "bar", Range.between Version.two Version.three ) ]

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


{-| Example 3: performing conflict resolution

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#performing-conflict-resolution>

-}
listAvailableVersions3 : String -> List Version
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


{-| -}
getDependencies3 : String -> Version -> Maybe (List ( String, Range ))
getDependencies3 package version =
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


{-| Example 4: conflict resolution with a partial satisfier

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#conflict-resolution-with-a-partial-satisfier>

-}
listAvailableVersions4 : String -> List Version
listAvailableVersions4 package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one, Version.new_ 1 1 0 ]
                |> List.reverse

        "left" ->
            [ Version.one ]

        "right" ->
            [ Version.one ]

        "shared" ->
            [ Version.one, Version.two ]

        "target" ->
            [ Version.one, Version.two ]

        _ ->
            []


{-| -}
getDependencies4 : String -> Version -> Maybe (List ( String, Range ))
getDependencies4 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just
                [ ( "foo", Range.between Version.one Version.two )
                , ( "target", Range.between Version.two Version.three )
                ]

        ( "foo", ( 1, 1, 0 ) ) ->
            Just
                [ ( "left", Range.between Version.one Version.two )
                , ( "right", Range.between Version.one Version.two )
                ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just []

        ( "left", ( 1, 0, 0 ) ) ->
            Just [ ( "shared", Range.higherThan Version.one ) ]

        ( "right", ( 1, 0, 0 ) ) ->
            Just [ ( "shared", Range.lowerThan Version.two ) ]

        ( "shared", ( 2, 0, 0 ) ) ->
            Just []

        ( "shared", ( 1, 0, 0 ) ) ->
            Just [ ( "target", Range.between Version.one Version.two ) ]

        ( "target", ( 2, 0, 0 ) ) ->
            Just []

        ( "target", ( 1, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


{-| Example 5: Linear error reporting

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#linear-error-reporting>

-}
listAvailableVersions5 : String -> List Version
listAvailableVersions5 package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one ]

        "bar" ->
            [ Version.two ]

        "baz" ->
            [ Version.one, Version.three ]

        _ ->
            []


{-| -}
getDependencies5 : String -> Version -> Maybe (List ( String, Range ))
getDependencies5 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just
                [ ( "baz", Range.between Version.one Version.two )
                , ( "foo", Range.between Version.one Version.two )
                ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just [ ( "bar", Range.between Version.two Version.three ) ]

        ( "bar", ( 2, 0, 0 ) ) ->
            Just [ ( "baz", Range.between Version.three (Version.new_ 4 0 0) ) ]

        ( "baz", ( 1, 0, 0 ) ) ->
            Just []

        ( "baz", ( 3, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


{-| Example 5 (slightly modified): Linear error reporting

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#linear-error-reporting>

-}
listAvailableVersions5bis : String -> List Version
listAvailableVersions5bis package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one ]

        "bar" ->
            [ Version.two, Version.new_ 2 1 0 ]

        "baz" ->
            [ Version.one, Version.three ]

        _ ->
            []


{-| -}
getDependencies5bis : String -> Version -> Maybe (List ( String, Range ))
getDependencies5bis package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just
                [ ( "baz", Range.between Version.one Version.two )
                , ( "foo", Range.between Version.one Version.two )
                ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just [ ( "bar", Range.between Version.two Version.three ) ]

        ( "bar", ( 2, 0, 0 ) ) ->
            Just [ ( "baz", Range.between Version.three (Version.new_ 4 0 0) ) ]

        ( "bar", ( 2, 1, 0 ) ) ->
            Just [ ( "baz", Range.between Version.two (Version.new_ 3 0 0) ) ]

        ( "baz", ( 1, 0, 0 ) ) ->
            Just []

        ( "baz", ( 3, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


{-| Example 6: Branching error reporting

<https://github.com/dart-lang/pub/blob/master/doc/solver.md#branching-error-reporting>

-}
listAvailableVersions6 : String -> List Version
listAvailableVersions6 package =
    case package of
        "root" ->
            [ Version.one ]

        "foo" ->
            [ Version.one, Version.new_ 1 1 0 ]

        "a" ->
            [ Version.one ]

        "b" ->
            [ Version.one, Version.two ]

        "x" ->
            [ Version.one ]

        "y" ->
            [ Version.one, Version.two ]

        _ ->
            []


{-| -}
getDependencies6 : String -> Version -> Maybe (List ( String, Range ))
getDependencies6 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.between Version.one Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just
                [ ( "a", Range.between Version.one Version.two )
                , ( "b", Range.between Version.one Version.two )
                ]

        ( "foo", ( 1, 1, 0 ) ) ->
            Just
                [ ( "x", Range.between Version.one Version.two )
                , ( "y", Range.between Version.one Version.two )
                ]

        ( "a", ( 1, 0, 0 ) ) ->
            Just [ ( "b", Range.between Version.two Version.three ) ]

        ( "b", ( 1, 0, 0 ) ) ->
            Just []

        ( "b", ( 2, 0, 0 ) ) ->
            Just []

        ( "x", ( 1, 0, 0 ) ) ->
            Just [ ( "y", Range.between Version.two Version.three ) ]

        ( "y", ( 1, 0, 0 ) ) ->
            Just []

        ( "y", ( 2, 0, 0 ) ) ->
            Just []

        _ ->
            Nothing


{-| Example 7: transitive dependency to incompatible root
-}
listAvailableVersions7 : String -> List Version
listAvailableVersions7 package =
    case package of
        "root" ->
            [ Version.one, Version.two ]

        "bar" ->
            [ Version.one, Version.two ]
                |> List.reverse

        "foo" ->
            [ Version.one, Version.two ]
                |> List.reverse

        _ ->
            []


{-| -}
getDependencies7 : String -> Version -> Maybe (List ( String, Range ))
getDependencies7 package version =
    case ( package, Version.toTuple version ) of
        ( "root", ( 1, 0, 0 ) ) ->
            Just [ ( "bar", Range.higherThan Version.one ) ]

        ( "root", ( 2, 0, 0 ) ) ->
            Just []

        ( "bar", ( 1, 0, 0 ) ) ->
            Just [ ( "foo", Range.higherThan Version.one ) ]

        ( "bar", ( 2, 0, 0 ) ) ->
            Just [ ( "foo", Range.higherThan Version.two ) ]

        ( "foo", ( 1, 0, 0 ) ) ->
            Just []

        ( "foo", ( 2, 0, 0 ) ) ->
            Just [ ( "root", Range.higherThan Version.two ) ]

        _ ->
            Nothing
