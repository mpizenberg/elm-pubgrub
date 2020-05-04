module Term exposing (Relation(..), Term(..), acceptVersion, acceptVersionJust, contradicts, intersection, isPositive, listIntersection, negate, relation, satisfies, toDebugString, union)

import Range exposing (Range)
import Version exposing (Version)


type Term
    = Positive Range
    | Negative Range


type Relation
    = Satisfies
    | Contradicts
    | Inconclusive



-- Debug


toDebugString : Term -> String
toDebugString term =
    case term of
        Positive range ->
            Range.toDebugString range

        Negative range ->
            "Not ( " ++ Range.toDebugString range ++ " )"



-- Functions


isPositive : Term -> Bool
isPositive term =
    case term of
        Positive _ ->
            True

        _ ->
            False


negate : Term -> Term
negate term =
    case term of
        Positive range ->
            Negative range

        Negative range ->
            Positive range


relation : Term -> List Term -> Relation
relation term set =
    let
        setIntersection =
            listIntersection Nothing set

        fullIntersection =
            intersection term setIntersection
    in
    if setIntersection == fullIntersection then
        Satisfies

    else if Positive Range.none == fullIntersection then
        Contradicts

    else
        Inconclusive


{-| Wondering if it would be better to return a Maybe Term
and let the caller decide what should be the default if Nothing.
-}
listIntersection : Maybe Term -> List Term -> Term
listIntersection initial terms =
    List.foldl intersection (Maybe.withDefault (Negative Range.none) initial) terms


contradicts : Term -> List Term -> Bool
contradicts term set =
    -- Not sure about the behavior for the empty list ...
    listIntersection (Just term) set == Positive Range.none


satisfies : Term -> List Term -> Bool
satisfies term set =
    -- Not sure about the behavior for the empty list ...
    subsetOf term (listIntersection Nothing set)


subsetOf : Term -> Term -> Bool
subsetOf t1 t2 =
    t2 == intersection t1 t2


intersection : Term -> Term -> Term
intersection t1 t2 =
    case ( t1, t2 ) of
        ( Positive r1, Positive r2 ) ->
            Positive (Range.intersection r1 r2)

        ( Positive r1, Negative r2 ) ->
            Positive (Range.intersection r1 (Range.negate r2))

        ( Negative r1, Positive r2 ) ->
            Positive (Range.intersection (Range.negate r1) r2)

        ( Negative r1, Negative r2 ) ->
            Negative (Range.union r1 r2)


union : Term -> Term -> Term
union t1 t2 =
    case ( t1, t2 ) of
        ( Positive r1, Positive r2 ) ->
            Positive (Range.union r1 r2)

        ( Positive r1, Negative r2 ) ->
            Positive (Range.union r1 (Range.negate r2))

        ( Negative r1, Positive r2 ) ->
            Positive (Range.union (Range.negate r1) r2)

        ( Negative r1, Negative r2 ) ->
            Negative (Range.intersection r1 r2)


acceptVersion : Maybe Version -> Term -> Bool
acceptVersion maybeVersion term =
    case ( maybeVersion, term ) of
        ( Nothing, Positive _ ) ->
            False

        ( Nothing, Negative _ ) ->
            True

        ( Just version, _ ) ->
            acceptVersionJust version term


acceptVersionJust : Version -> Term -> Bool
acceptVersionJust version term =
    case term of
        Positive range ->
            Range.contains version range

        Negative range ->
            Range.contains version (Range.negate range)
