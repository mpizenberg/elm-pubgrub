module Term exposing (Relation(..), Term(..), acceptVersion, acceptVersionJust, contradicts, intersection, isPositive, listIntersection, negate, relation, satisfies, union)

import Range exposing (Range)
import Version exposing (Version)


type Term
    = Positive Range
    | Negative Range


type Relation
    = Satisfies
    | Contradicts
    | Inconclusive


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
    if equals (Positive Range.None) fullIntersection then
        Contradicts

    else if equals setIntersection fullIntersection then
        Satisfies

    else
        Inconclusive


{-| Wondering if it would be better to return a Maybe Term
and let the caller decide what should be the default if Nothing.
-}
listIntersection : Maybe Term -> List Term -> Term
listIntersection initial terms =
    List.foldl intersection (Maybe.withDefault (Negative Range.None) initial) terms


contradicts : Term -> List Term -> Bool
contradicts term set =
    -- Not sure about the behavior for the empty list ...
    listIntersection (Just term) set
        |> equals (Positive Range.None)


satisfies : Term -> List Term -> Bool
satisfies term set =
    -- Not sure about the behavior for the empty list ...
    subsetOf term (listIntersection Nothing set)


subsetOf : Term -> Term -> Bool
subsetOf t1 t2 =
    equals t2 (intersection t1 t2)


equals : Term -> Term -> Bool
equals t1 t2 =
    case ( t1, t2 ) of
        ( Positive r1, Positive r2 ) ->
            Range.equals r1 r2

        ( Negative r1, Negative r2 ) ->
            Range.equals r1 r2

        _ ->
            False


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
            Range.acceptVersion version range

        Negative range ->
            Range.acceptVersion version (Range.negate range)
