module Range exposing
    ( Range
    , toDebugString
    , none, any, exact, higherThan, lowerThan, between
    , negate, intersection, union
    , contains, getExactVersion
    )

{-| Dealing with version ranges union and intersecion.

@docs Range

@docs toDebugString

@docs none, any, exact, higherThan, lowerThan, between

@docs negate, intersection, union

@docs contains, getExactVersion

-}

import Version exposing (Version)


type Range
    = None
    | Any
    | Intervals (List Interval)


type alias Interval =
    ( Version, Maybe Version )



-- Debug


toDebugString : Range -> String
toDebugString range =
    case range of
        None ->
            "∅"

        Any ->
            "∗"

        Intervals intervals ->
            intervalsToString intervals


intervalsToString : List Interval -> String
intervalsToString intervals =
    case intervals of
        [] ->
            "[]"

        ( start, Nothing ) :: [] ->
            Version.toDebugString start ++ " <= v"

        ( start, Just end ) :: [] ->
            if start == Version.zero then
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
    None


any : Range
any =
    Any


exact : Version -> Range
exact version =
    Intervals [ ( version, Just (Version.bumpPatch version) ) ]


higherThan : Version -> Range
higherThan version =
    cleanFirstInterval [ ( version, Nothing ) ]


lowerThan : Version -> Range
lowerThan version =
    cleanFirstInterval [ ( Version.zero, Just version ) ]


between : Version -> Version -> Range
between v1 v2 =
    if Version.higherThan v1 v2 then
        Intervals [ ( v1, Just v2 ) ]

    else
        None



-- Set operation: negate


negate : Range -> Range
negate range =
    case range of
        None ->
            Any

        Any ->
            None

        Intervals intervals ->
            cleanFirstInterval (negateIntervals Version.zero [] intervals)


negateIntervals : Version -> List Interval -> List Interval -> List Interval
negateIntervals lastVersion accum intervals =
    case intervals of
        [] ->
            List.reverse (( lastVersion, Nothing ) :: accum)

        ( start, Nothing ) :: _ ->
            List.reverse (( lastVersion, Just start ) :: accum)

        ( start, Just end ) :: rest ->
            negateIntervals end (( lastVersion, Just start ) :: accum) rest


cleanFirstInterval : List Interval -> Range
cleanFirstInterval intervals =
    case intervals of
        [] ->
            None

        ( start, Just end ) :: others ->
            if start == end then
                cleanFirstInterval others

            else
                Intervals intervals

        ( start, Nothing ) :: _ ->
            if start == Version.zero then
                Any

            else
                Intervals intervals



-- Set operation: union and intersection


union : Range -> Range -> Range
union r1 r2 =
    negate (intersection (negate r1) (negate r2))


intersection : Range -> Range -> Range
intersection r1 r2 =
    case ( r1, r2 ) of
        ( None, _ ) ->
            None

        ( _, None ) ->
            None

        ( Any, _ ) ->
            r2

        ( _, Any ) ->
            r1

        ( Intervals i1, Intervals i2 ) ->
            cleanFirstInterval (intervalsIntersection [] i1 i2)


intervalsIntersection : List Interval -> List Interval -> List Interval -> List Interval
intervalsIntersection accum left right =
    case ( left, right ) of
        ( ( l1, Just l2 ) :: ls, ( r1, Just r2 ) :: rs ) ->
            if not (Version.lowerThan l2 r1) then
                -- Intervals are disjoint since l2 <= r1
                intervalsIntersection accum ls right

            else if not (Version.lowerThan r2 l1) then
                -- Intervals are disjoint since r22 <= l1
                intervalsIntersection accum left rs

            else
                -- Intervals are not disjoint
                let
                    start =
                        Version.max l1 r1
                in
                if Version.higherThan l2 r2 then
                    intervalsIntersection (( start, Just l2 ) :: accum) ls right

                else
                    intervalsIntersection (( start, Just r2 ) :: accum) left rs

        ( ( l1, Just l2 ) :: ls, ( r1, Nothing ) :: _ ) ->
            if Version.higherThan l2 r1 then
                intervalsIntersection accum ls right

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
            intervalsIntersection accum right left


reversePrepend : List a -> List a -> List a
reversePrepend rev accum =
    case rev of
        [] ->
            accum

        x :: xs ->
            reversePrepend xs (x :: accum)



-- Check if a version is in range


contains : Version -> Range -> Bool
contains version range =
    case range of
        None ->
            False

        Any ->
            True

        Intervals intervals ->
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
getExactVersion range =
    case range of
        Intervals (( start, Just end ) :: []) ->
            if Version.bumpPatch start == end then
                Just start

            else
                Nothing

        _ ->
            Nothing
