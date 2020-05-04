module Range exposing
    ( Range
    , toDebugString
    , none, any, exact, higherThan, lowerThan, between
    , negate, intersection, union
    , contains, getExactVersion
    )

{-| Dealing with version ranges union and intersection.

@docs Range

@docs toDebugString

@docs none, any, exact, higherThan, lowerThan, between

@docs negate, intersection, union

@docs contains, getExactVersion

-}

import Version exposing (Version)


type Range
    = Range (List Interval)


type alias Interval =
    ( Version, Maybe Version )



-- Debug


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


none : Range
none =
    Range []


any : Range
any =
    higherThan Version.zero


exact : Version -> Range
exact version =
    Range [ ( version, Just (Version.bumpPatch version) ) ]


higherThan : Version -> Range
higherThan version =
    Range [ ( version, Nothing ) ]


lowerThan : Version -> Range
lowerThan version =
    if version == Version.zero then
        none

    else
        Range [ ( Version.zero, Just version ) ]


between : Version -> Version -> Range
between v1 v2 =
    if Version.higherThan v1 v2 then
        Range [ ( v1, Just v2 ) ]

    else
        none



-- Set operation: negate


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


union : Range -> Range -> Range
union r1 r2 =
    negate (intersection (negate r1) (negate r2))


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


getExactVersion : Range -> Maybe Version
getExactVersion (Range intervals) =
    case intervals of
        ( start, Just end ) :: [] ->
            if Version.bumpPatch start == end then
                Just start

            else
                Nothing

        _ ->
            Nothing
