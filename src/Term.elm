module Term exposing
    ( Term(..), isPositive, negate, toDebugString
    , acceptVersion, acceptVersionJust
    , intersection, union, listIntersection
    , Relation(..), satisfies, contradicts, relation
    )

{-| A term is the fundamental unit of operation of the PubGrub algorithm.
It is a positive or negative expression regarding a selection of versions.
This module exposes types and functions to deal with terms.

@docs Term, isPositive, negate, toDebugString

@docs acceptVersion, acceptVersionJust


# Set operations with terms

@docs intersection, union, listIntersection


# Relation between terms

@docs Relation, satisfies, contradicts, relation

-}

import Range exposing (Range)
import Version exposing (Version)


{-| A positive or negative expression regarding a selection of versions.

For example, "1.0.0 <= v < 2.0.0" is a positive expression
that is evaluated true if a version is selected and
comprised between version 1.0.0 and version 2.0.0.
The term "not v < 3.0.0" is a negative expression
that is evaluated true if a version is selected >= 3.0.0
or if no version is selected at all.

-}
type Term
    = Positive Range
    | Negative Range


{-| Describe a relation between a term and another set of terms.
Here is a description extracted from PubGrub documentation.

We say that a set of terms S "satisfies"
a term t if t must be true whenever every term in S is true.
Conversely, S "contradicts" t if t must be false
whenever every term in S is true.
If neither of these is true
we say that S is "inconclusive" for t.
As a shorthand, we say that
a term v satisfies or contradicts t if
{v} satisfies or contradicts it.

-}
type Relation
    = Satisfies
    | Contradicts
    | Inconclusive



-- Debug


{-| String representation of a term, for debug purposes.
-}
toDebugString : Term -> String
toDebugString term =
    case term of
        Positive range ->
            Range.toDebugString range

        Negative range ->
            "Not ( " ++ Range.toDebugString range ++ " )"



-- Functions


{-| Simply check if a term is positive.
-}
isPositive : Term -> Bool
isPositive term =
    case term of
        Positive _ ->
            True

        _ ->
            False


{-| Negate a term.
Evaluation of a negated term always returns the opposite
of the evaluation of the original one.
-}
negate : Term -> Term
negate term =
    case term of
        Positive range ->
            Negative range

        Negative range ->
            Positive range


{-| Check if a set of terms satisfies or contradicts
a given term. Otherwise the relation is inconclusive.
-}
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


{-| Compute the intersection of a list of terms.
An initial term may be provided.
Otherwise `not ∅` will be used as initialization for the intersection.

Wondering if it would be better to return a Maybe Term
and let the caller decide what should mean
the intersection of an empty list of terms.

-}
listIntersection : Maybe Term -> List Term -> Term
listIntersection initial terms =
    List.foldl intersection (Maybe.withDefault (Negative Range.none) initial) terms


{-| Check if a set of terms contradicts a given term.

We say that a set of terms S "contradicts"
a term t if t must be false whenever every term in S is true.

-}
contradicts : Term -> List Term -> Bool
contradicts term set =
    -- Not sure about the behavior for the empty list ...
    listIntersection (Just term) set == Positive Range.none


{-| Check if a set of terms satisfies a given term.

We say that a set of terms S "satisfies"
a term t if t must be true whenever every term in S is true.

-}
satisfies : Term -> List Term -> Bool
satisfies term set =
    -- Not sure about the behavior for the empty list ...
    subsetOf term (listIntersection Nothing set)


subsetOf : Term -> Term -> Bool
subsetOf t1 t2 =
    t2 == intersection t1 t2


{-| Compute the intersection of two terms.
If at least one term is positive,
the intersection is a positive term.
-}
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


{-| Compute the union of two terms.
If at least one term is positive,
the union is a positive term.
-}
union : Term -> Term -> Term
union t1 t2 =
    negate (intersection (negate t1) (negate t2))


{-| Evaluate a term regarding a given choice
(or absence of choice) of a version.
-}
acceptVersion : Maybe Version -> Term -> Bool
acceptVersion maybeVersion term =
    case ( maybeVersion, term ) of
        ( Nothing, Positive _ ) ->
            False

        ( Nothing, Negative _ ) ->
            True

        ( Just version, _ ) ->
            acceptVersionJust version term


{-| Evaluate a term regarding a given choice of version.
-}
acceptVersionJust : Version -> Term -> Bool
acceptVersionJust version term =
    case term of
        Positive range ->
            Range.contains version range

        Negative range ->
            Range.contains version (Range.negate range)
