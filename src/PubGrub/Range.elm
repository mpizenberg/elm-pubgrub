module PubGrub.Range exposing
    ( Range, toDebugString
    , none, any, exact, higherThan, lowerThan, between
    , negate, intersection, union
    , contains
    )

{-| Dealing with version ranges union and intersection.

@docs Range, toDebugString


# Creation of a range selection

@docs none, any, exact, higherThan, lowerThan, between


# Set operations on ranges

@docs negate, intersection, union


# Evaluate if a range contains a given version

@docs contains

-}

import PubGrub.Version as Version exposing (Version)


{-| A range corresponds to any set of versions
representable as a concatenation, union, and complement
of version ranges building blocks.

Those building blocks are:

  - `none`: the empty set
  - `any`: the set of all possible versions
  - `exact v`: the singleton set of only version `v`
  - `higherThan v`: the set of versions higher or equal to `v`
  - `lowerThan v`: the set of versions strictly lower than `v`
  - `between v1 v2`: the set of versions higher or equal
    to `v1` and strictly lower than `v2`

Internally, they are represented as an ordered list of intervals
to have a normalized form enabling comparisons of ranges.

-}
type Range
    = Range (List Interval)


{-| Finite or infinite interval.
If the second element of the tuple is `Nothing`,
this is an infinite interval of the form [v, +∞[.
All other intervals are of the form [v1, v2[
where the second element of the tuple is excluded.
-}
type alias Interval =
    ( Version, Maybe Version )



-- Debug


{-| Displayable representation of a range, for debug purposes
-}
toDebugString : Range -> String
toDebugString (Range intervals) =
    case intervals of
        [] ->
            "∅"

        ( start, Nothing ) :: [] ->
            if start == Version.zero then
                "∗"

            else
                Version.toDebugString start ++ " <= v"

        ( start, Just end ) :: [] ->
            if end == Version.new_ 0 0 1 then
                Version.toDebugString start

            else if start == Version.zero then
                "v < " ++ Version.toDebugString end

            else if Version.bumpPatch start == end then
                Version.toDebugString start

            else
                Version.toDebugString start ++ " <= v < " ++ Version.toDebugString end

        _ ->
            List.map intervalToString intervals
                |> String.join "  "


intervalToString : Interval -> String
intervalToString interval =
    case interval of
        ( start, Just end ) ->
            "[ " ++ Version.toDebugString start ++ ", " ++ Version.toDebugString end ++ " ["

        ( start, Nothing ) ->
            "[ " ++ Version.toDebugString start ++ ", ∞ ["



-- Constructors


{-| Empty set of versions.

    none == lowerThan zero

-}
none : Range
none =
    Range []


{-| Set of all possible versions.

    any == higherThan zero

-}
any : Range
any =
    higherThan Version.zero


{-| Set containing exactly one version.

    exact v == intersection (higherThan v) (lowerThan <| bumpPatch v)

-}
exact : Version -> Range
exact version =
    Range [ ( version, Just (Version.bumpPatch version) ) ]


{-| Set of all versions higher or equal to some version.
-}
higherThan : Version -> Range
higherThan version =
    Range [ ( version, Nothing ) ]


{-| Set of all versions strictly lower than some version.
-}
lowerThan : Version -> Range
lowerThan version =
    if version == Version.zero then
        none

    else
        Range [ ( Version.zero, Just version ) ]


{-| Set of versions comprised between two given versions.
The lower bound is included and the higher bound excluded.
`v1 <= v < v2`.

    between v1 v2 == intersection (higherThan v1) (lowerThan v2)

-}
between : Version -> Version -> Range
between v1 v2 =
    if Version.higherThan v1 v2 then
        Range [ ( v1, Just v2 ) ]

    else
        none



-- Set operation: negate


{-| Compute the complement set of versions.
-}
negate : Range -> Range
negate (Range intervals) =
    cleanFirstInterval (negateHelper Version.zero [] intervals)


negateHelper : Version -> List Interval -> List Interval -> List Interval
negateHelper lastVersion accum intervals =
    case intervals of
        [] ->
            List.reverse (( lastVersion, Nothing ) :: accum)

        ( start, Nothing ) :: _ ->
            List.reverse (( lastVersion, Just start ) :: accum)

        ( start, Just end ) :: rest ->
            negateHelper end (( lastVersion, Just start ) :: accum) rest


cleanFirstInterval : List Interval -> Range
cleanFirstInterval intervals =
    case intervals of
        ( _, Just end ) :: others ->
            if end == Version.zero then
                Range others

            else
                Range intervals

        _ ->
            Range intervals



-- Set operation: union and intersection


{-| Compute union of two sets of versions.
-}
union : Range -> Range -> Range
union r1 r2 =
    negate (intersection (negate r1) (negate r2))


{-| Compute intersection of two sets of versions.
-}
intersection : Range -> Range -> Range
intersection (Range i1) (Range i2) =
    Range (intersectionHelper [] i1 i2)


intersectionHelper : List Interval -> List Interval -> List Interval -> List Interval
intersectionHelper accum left right =
    case ( left, right ) of
        ( ( l1, Just l2 ) :: ls, ( r1, Just r2 ) :: rs ) ->
            if not (Version.lowerThan l2 r1) then
                -- Intervals are disjoint since l2 <= r1
                intersectionHelper accum ls right

            else if not (Version.lowerThan r2 l1) then
                -- Intervals are disjoint since r22 <= l1
                intersectionHelper accum left rs

            else
                -- Intervals are not disjoint
                let
                    start =
                        Version.max l1 r1
                in
                if Version.higherThan l2 r2 then
                    intersectionHelper (( start, Just l2 ) :: accum) ls right

                else
                    intersectionHelper (( start, Just r2 ) :: accum) left rs

        ( ( l1, Just l2 ) :: ls, ( r1, Nothing ) :: _ ) ->
            if Version.higherThan l2 r1 then
                intersectionHelper accum ls right

            else if l2 == r1 then
                reversePrepend accum ls

            else if Version.higherThan l1 r1 then
                reversePrepend accum (( r1, Just l2 ) :: ls)

            else
                reversePrepend accum left

        ( ( l1, Nothing ) :: _, ( r1, Nothing ) :: _ ) ->
            List.reverse (( Version.max l1 r1, Nothing ) :: accum)

        ( [], _ ) ->
            List.reverse accum

        _ ->
            intersectionHelper accum right left


reversePrepend : List a -> List a -> List a
reversePrepend rev accum =
    case rev of
        [] ->
            accum

        x :: xs ->
            reversePrepend xs (x :: accum)



-- Check if a version is in range


{-| Check if a range selection contains a given version.
-}
contains : Version -> Range -> Bool
contains version (Range intervals) =
    intervalsContains version intervals


intervalsContains : Version -> List Interval -> Bool
intervalsContains version intervals =
    case intervals of
        [] ->
            False

        ( start, Nothing ) :: _ ->
            not (Version.lowerThan start version)

        ( start, Just end ) :: others ->
            let
                found =
                    not (Version.lowerThan start version)
                        && Version.higherThan version end
            in
            if found then
                True

            else
                intervalsContains version others
