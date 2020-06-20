module PartialSolution exposing
    ( PartialSolution, empty, toDebugString
    , solution
    , prependDecision, prependDerivation, dropUntilLevel
    , potentialPackages, addVersion, relation
    , findSatisfier, findPreviousSatisfier
    )

{-| The partial solution is the current state of our solution.
This module provides functions to manage it.

@docs PartialSolution, empty, toDebugString


# Final solution

@docs solution


# Building and backtracking a partial solution

@docs prependDecision, prependDerivation, dropUntilLevel


# Choosing a new package

@docs potentialPackages, addVersion, relation


# Satisfiers

@docs findSatisfier, findPreviousSatisfier

-}

import Assignment exposing (Assignment)
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility, Relation)
import Json.Encode exposing (Value)
import Range
import Term exposing (Term)
import Utils exposing (SearchDecision(..))
import Version exposing (Version)


{-| The partial solution is the current state of our solution.
It is composed by a succession of assignments,
which are either decisions or derivations.

Internally, it has a dual representation in our implementation.
A list enables fast backtracking into a previous correct state
when solving conflicts,
and a memory dictionary is useful in other parts of the algorithm
requiring fast access to a given package in previous assignments.
It could be fun to benchmark to check that it is actually useful.

-}
type PartialSolution
    = PartialSolution (List ( Assignment, Memory ))


{-| Memory is the set of all assignments previous to (including)
its paired assignment in the partial solution list.
Those previous assignments are regrouped by package,
making it easier to find out if a decision was made for a given package,
and to list all corresponding derivations of a package.
-}
type alias Memory =
    Dict String PackageMemory


{-| A package memory contains the potential decision and derivations
that have already been made for a given package.
-}
type alias PackageMemory =
    { decision : Maybe Version
    , derivations : List Term
    }


{-| Initialization of a partial solution.
-}
empty : PartialSolution
empty =
    PartialSolution []



-- Debug


{-| Printable String version of a partial solution,
for debug purposes.
-}
toDebugString : PartialSolution -> String
toDebugString partial =
    Json.Encode.encode 2 (encode partial)


encode : PartialSolution -> Value
encode (PartialSolution partial) =
    Json.Encode.list (Assignment.encodeDebug << Tuple.first) partial



-- Functions


{-| Extract all packages that may potentially be picked next
to continue solving package dependencies.
A package is a potential pick if there isn't an already
version selected (no "decision")
and if it contains at least one positive derivation term
in the partial solution.
-}
potentialPackages : PartialSolution -> Dict String (List Term)
potentialPackages (PartialSolution partial) =
    case partial of
        [] ->
            Dict.empty

        ( _, memory ) :: _ ->
            Utils.dictFilterMap potentialPackage memory


potentialPackage : String -> { decision : Maybe Version, derivations : List Term } -> Maybe (List Term)
potentialPackage _ { decision, derivations } =
    if decision == Nothing && List.any Term.isPositive derivations then
        Just derivations

    else
        Nothing


{-| We can add the version to the partial solution as a decision
if it doesn't produce any conflict with the new incompatibilities.
In practice I think it can only produce a conflict if one of the dependencies
(which are used to make the new incompatibilities)
is already in the partial solution with an incompatible version.
-}
addVersion : String -> Version -> List Incompatibility -> PartialSolution -> Maybe PartialSolution
addVersion name version newIncompatibilities partial =
    let
        updatedPartial =
            prependDecision name version partial
    in
    if doesNotSatisfy newIncompatibilities updatedPartial then
        Just updatedPartial

    else
        Nothing


doesNotSatisfy : List Incompatibility -> PartialSolution -> Bool
doesNotSatisfy newIncompatibilities (PartialSolution partial) =
    case ( newIncompatibilities, partial ) of
        ( _, [] ) ->
            True

        ( [], _ ) ->
            True

        ( incompat :: others, ( _, memory ) :: _ ) ->
            case Incompatibility.relation (Dict.map memoryTerms memory) incompat of
                Incompatibility.Satisfies ->
                    False

                _ ->
                    doesNotSatisfy others (PartialSolution partial)


{-| Check if the terms in the partial solution
satisfy the incompatibility.

TODO: why am I not using List.map (Tuple.first >> Assignment.getTerm)?
Probably because I need a Dict for Incompatibility.relation ...

-}
relation : Incompatibility -> PartialSolution -> Relation
relation incompatibility (PartialSolution partial) =
    case partial of
        [] ->
            Incompatibility.relation Dict.empty incompatibility

        ( _, memory ) :: _ ->
            Incompatibility.relation (Dict.map memoryTerms memory) incompatibility


memoryTerms : a -> PackageMemory -> List Term
memoryTerms _ { decision, derivations } =
    case decision of
        Nothing ->
            derivations

        Just version ->
            Term.Positive (Range.exact version) :: derivations


{-| Prepend a decision (a package with a version)
to the partial solution.
-}
prependDecision : String -> Version -> PartialSolution -> PartialSolution
prependDecision name version (PartialSolution partial) =
    case partial of
        [] ->
            PartialSolution
                [ ( Assignment.newDecision name version 0
                  , Dict.singleton name { decision = Just version, derivations = [] }
                  )
                ]

        ( { decisionLevel }, memory ) :: _ ->
            let
                _ =
                    Debug.log ("Decision level " ++ String.fromInt (decisionLevel + 1) ++ " : " ++ name ++ " : " ++ Version.toDebugString version) ""

                decision =
                    Assignment.newDecision name version (decisionLevel + 1)

                newMemory =
                    Dict.update name (updateMemoryVersion version) memory
            in
            PartialSolution (( decision, newMemory ) :: partial)


updateMemoryVersion : Version -> Maybe PackageMemory -> Maybe PackageMemory
updateMemoryVersion version maybe =
    case maybe of
        Nothing ->
            Just { decision = Just version, derivations = [] }

        Just { decision, derivations } ->
            case decision of
                Nothing ->
                    Just { decision = Just version, derivations = derivations }

                Just _ ->
                    Debug.todo "Cannot change a decision already made!"


{-| Prepend a package derivation term to the partial solution.
Also includes its cause.
-}
prependDerivation : String -> Term -> Incompatibility -> PartialSolution -> PartialSolution
prependDerivation name term cause (PartialSolution partial) =
    case partial of
        [] ->
            PartialSolution
                [ ( Assignment.newDerivation name term 0 cause
                  , Dict.singleton name { decision = Nothing, derivations = [ term ] }
                  )
                ]

        ( { decisionLevel }, memory ) :: _ ->
            let
                _ =
                    Debug.log ("Derivation : " ++ name ++ " : " ++ Term.toDebugString term) ""

                derivation =
                    Assignment.newDerivation name term decisionLevel cause

                newMemory =
                    Dict.update name (updateMemoryTerm term) memory
            in
            PartialSolution (( derivation, newMemory ) :: partial)


updateMemoryTerm : Term -> Maybe PackageMemory -> Maybe PackageMemory
updateMemoryTerm term maybe =
    case maybe of
        Nothing ->
            Just { decision = Nothing, derivations = [ term ] }

        Just { decision, derivations } ->
            Just { decision = decision, derivations = term :: derivations }


{-| Backtrack the partial solution to a given decision level.
-}
dropUntilLevel : Int -> PartialSolution -> PartialSolution
dropUntilLevel level (PartialSolution partial) =
    case partial of
        [] ->
            empty

        ( { decisionLevel }, _ ) :: others ->
            if decisionLevel > level then
                dropUntilLevel level (PartialSolution others)

            else
                let
                    debugString =
                        toDebugString (PartialSolution partial)

                    _ =
                        Debug.log ("Backtrack partial solution to:\n" ++ debugString) ""
                in
                PartialSolution partial


{-| A satisfier is the earliest assignment in partial solution such that the incompatibility
is satisfied by the partial solution up to and including that assignment.
Also returns all assignments earlier than the satisfier.
We call the term in the incompatibility that refers to the same package "term".
-}
findSatisfier : Incompatibility -> PartialSolution -> ( Assignment, PartialSolution, Term )
findSatisfier incompat (PartialSolution partial) =
    case Utils.find (searchSatisfier incompat addAssignment) partial of
        Just x ->
            x

        Nothing ->
            Debug.todo "should always find something"


{-| Earliest assignment in the partial solution before satisfier
such that incompatibility is satisfied by the partial solution up to
and including that assignment plus satisfier.
-}
findPreviousSatisfier : Assignment -> Incompatibility -> PartialSolution -> Maybe ( Assignment, PartialSolution, Term )
findPreviousSatisfier satisfier incompat (PartialSolution earlierPartial) =
    let
        buildMemory assignment earlierMemory =
            addAssignment satisfier (addAssignment assignment earlierMemory)
    in
    Utils.find (searchSatisfier incompat buildMemory) earlierPartial


addAssignment : Assignment -> Memory -> Memory
addAssignment assignment memory =
    case assignment.kind of
        Assignment.Decision version ->
            Dict.update assignment.name (updateMemoryVersion version) memory

        Assignment.Derivation term _ ->
            Dict.update assignment.name (updateMemoryTerm term) memory


searchSatisfier : Incompatibility -> (Assignment -> Memory -> Memory) -> { left : Int, right : Int } -> ( Assignment, Memory ) -> List ( Assignment, Memory ) -> SearchDecision ( Assignment, PartialSolution, Term )
searchSatisfier incompat buildMemory { left, right } ( assignment, _ ) earlier =
    let
        earlierMemory =
            List.head earlier
                |> Maybe.map Tuple.second
                |> Maybe.withDefault Dict.empty

        memory =
            buildMemory assignment earlierMemory
    in
    case Incompatibility.relation (Dict.map memoryTerms memory) incompat of
        -- if it satisfies, search right (earlier assignments)
        Incompatibility.Satisfies ->
            if right == 0 then
                case Dict.get assignment.name (Incompatibility.asDict incompat) of
                    Just term ->
                        Found
                            ( assignment
                            , PartialSolution earlier
                            , term
                            )

                    Nothing ->
                        Stop

            else
                KeepGoRight (max 1 (right // 2))

        -- if it does not satisfy, search left (later assignments)
        _ ->
            if left == 0 then
                Stop

            else
                GoLeft (max 1 (left // 2))



-- Final solution


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
solution : PartialSolution -> Maybe (List ( String, Version ))
solution (PartialSolution partial) =
    case partial of
        [] ->
            Just []

        ( _, memory ) :: _ ->
            if Utils.dictAll isValidPackage memory then
                Utils.dictFilterMap (\_ { decision } -> decision) memory
                    |> Dict.toList
                    |> Just

            else
                Nothing


isValidPackage : String -> PackageMemory -> Bool
isValidPackage _ { decision, derivations } =
    case decision of
        Nothing ->
            not (List.any Term.isPositive derivations)

        Just _ ->
            True
