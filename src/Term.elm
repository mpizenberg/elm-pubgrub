module Term exposing (Relation(..), Term(..), acceptVersion, contradicts, intersection, negate, relation, satisfies)

import Range exposing (Range)
import Version exposing (Version)


type Term
    = Positive Range
    | Negative Range


type Relation
    = Satisfies
    | Contradicts
    | Inconclusive


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
            List.foldl intersection (Negative Range.None) set

        fullIntersection =
            intersection term setIntersection
    in
    if equals (Positive Range.None) fullIntersection then
        Contradicts

    else if equals setIntersection fullIntersection then
        Satisfies

    else
        Inconclusive


contradicts : Term -> List Term -> Bool
contradicts term set =
    -- Not sure about the behavior for the empty list ...
    List.foldl intersection term set
        |> equals (Positive Range.None)


satisfies : Term -> List Term -> Bool
satisfies term set =
    -- Not sure about the behavior for the empty list ...
    List.foldl intersection (Negative Range.None) set
        |> subsetOf term


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
            Negative <|
                Range.negate (Range.intersection (Range.negate r1) (Range.negate r2))


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
