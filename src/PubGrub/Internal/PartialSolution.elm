module PubGrub.Internal.PartialSolution exposing
    ( PartialSolution, empty, toDebugString
    , solution
    , prependDecision, prependDerivation, backtrack
    , potentialPackages, addVersion, relation
    , findSatisfier, findPreviousSatisfier
    )

{-| The partial solution is the current state of our solution.
This module provides functions to manage it.

@docs PartialSolution, empty, toDebugString


# Final solution

@docs solution


# Building and backtracking a partial solution

@docs prependDecision, prependDerivation, backtrack


# Choosing a new package

@docs potentialPackages, addVersion, relation


# Satisfiers

@docs findSatisfier, findPreviousSatisfier

-}

import Dict exposing (Dict)
import Json.Encode exposing (Value)
import PubGrub.Internal.Assignment as Assignment exposing (Assignment)
import PubGrub.Internal.Incompatibility as Incompatibility exposing (Incompatibility, Relation)
import PubGrub.Internal.Memory as Memory exposing (Memory)
import PubGrub.Internal.Term as Term exposing (Term)
import PubGrub.Range as Range
import PubGrub.Version as Version exposing (Version)
import Utils


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
    = PartialSolution (List Assignment) Memory


{-| Initialization of a partial solution.
-}
empty : PartialSolution
empty =
    PartialSolution [] Dict.empty


fromAssignements : List Assignment -> PartialSolution
fromAssignements assignments =
    PartialSolution assignments
        (List.foldl Memory.addAssignment Dict.empty assignments)



-- Debug


{-| Printable String version of a partial solution,
for debug purposes.
-}
toDebugString : PartialSolution -> String
toDebugString partial =
    Json.Encode.encode 2 (encode partial)


encode : PartialSolution -> Value
encode (PartialSolution partial _) =
    Json.Encode.list Assignment.encodeDebug partial



-- Functions


{-| Extract all packages that may potentially be picked next
to continue solving package dependencies.
A package is a potential pick if there isn't an already
version selected (no "decision")
and if it contains at least one positive derivation term
in the partial solution.
-}
potentialPackages : PartialSolution -> Dict String (List Term)
potentialPackages (PartialSolution _ memory) =
    Memory.potentialPackages memory


{-| We can add the version to the partial solution as a decision
if it doesn't produce any conflict with the new incompatibilities.
In practice I think it can only produce a conflict if one of the dependencies
(which are used to make the new incompatibilities)
is already in the partial solution with an incompatible version.
-}
addVersion : String -> Version -> List Incompatibility -> PartialSolution -> Maybe PartialSolution
addVersion package version newIncompatibilities partial =
    let
        updatedPartial =
            prependDecision package version partial
    in
    if doesNotSatisfy newIncompatibilities updatedPartial then
        Just updatedPartial

    else
        Nothing


doesNotSatisfy : List Incompatibility -> PartialSolution -> Bool
doesNotSatisfy newIncompatibilities ((PartialSolution _ memory) as partial) =
    case newIncompatibilities of
        [] ->
            True

        incompat :: others ->
            case Incompatibility.relation (Memory.terms memory) incompat of
                Incompatibility.Satisfies ->
                    False

                _ ->
                    doesNotSatisfy others partial


{-| Check if the terms in the partial solution
satisfy the incompatibility.
-}
relation : Incompatibility -> PartialSolution -> Relation
relation incompatibility (PartialSolution _ memory) =
    Incompatibility.relation (Memory.terms memory) incompatibility


{-| Prepend a decision (a package with a version)
to the partial solution.
-}
prependDecision : String -> Version -> PartialSolution -> PartialSolution
prependDecision package version (PartialSolution partial memory) =
    case partial of
        [] ->
            PartialSolution
                [ Assignment.newDecision package version 0 ]
                (Dict.singleton package { decision = Just version, derivations = [] })

        { decisionLevel } :: _ ->
            let
                _ =
                    Debug.log ("Decision level " ++ String.fromInt (decisionLevel + 1) ++ " : " ++ package ++ " : " ++ Version.toDebugString version) ""

                decision =
                    Assignment.newDecision package version (decisionLevel + 1)

                newMemory =
                    Memory.addDecision package version memory
            in
            PartialSolution (decision :: partial) newMemory


{-| Prepend a package derivation term to the partial solution.
Also includes its cause.
-}
prependDerivation : String -> Term -> Incompatibility -> PartialSolution -> PartialSolution
prependDerivation package term cause (PartialSolution partial memory) =
    case partial of
        [] ->
            PartialSolution
                [ Assignment.newDerivation package term 0 cause ]
                (Dict.singleton package { decision = Nothing, derivations = [ term ] })

        { decisionLevel } :: _ ->
            let
                _ =
                    Debug.log ("Derivation : " ++ package ++ " : " ++ Term.toDebugString term) ""

                derivation =
                    Assignment.newDerivation package term decisionLevel cause

                newMemory =
                    Memory.addDerivation package term memory
            in
            PartialSolution (derivation :: partial) newMemory


{-| Backtrack the partial solution to a given decision level.
-}
backtrack : Int -> PartialSolution -> PartialSolution
backtrack level (PartialSolution partial _) =
    let
        _ =
            Debug.log "backtrack to level" level
    in
    fromAssignements (dropUntilLevel level partial)


dropUntilLevel : Int -> List Assignment -> List Assignment
dropUntilLevel level assignments =
    case assignments of
        [] ->
            []

        { decisionLevel } :: others ->
            if decisionLevel > level then
                dropUntilLevel level others

            else
                assignments


{-| A satisfier is the earliest assignment in partial solution such that the incompatibility
is satisfied by the partial solution up to and including that assignment.
Also returns all assignments earlier than the satisfier.
We call the term in the incompatibility that refers to the same package "term".
-}
findSatisfier : Incompatibility -> PartialSolution -> ( Assignment, PartialSolution, Term )
findSatisfier incompat (PartialSolution partial _) =
    if List.isEmpty partial then
        Debug.todo "We should never call findSatisfier with an empty partial solution"

    else
        let
            incompatDict =
                Incompatibility.asDict incompat

            accumSatisfier =
                Dict.map (\_ _ -> ( False, Term.Negative Range.none )) incompatDict
        in
        case findSatisfierHelper incompatDict accumSatisfier [] (List.reverse partial) of
            -- Not using Maybe.withDefault because Debug.todo crashes
            Nothing ->
                Debug.todo "Should always find a satisfier right?"

            Just value ->
                value


{-| Earliest assignment in the partial solution before satisfier
such that incompatibility is satisfied by the partial solution up to
and including that assignment plus satisfier.
-}
findPreviousSatisfier : Assignment -> Incompatibility -> PartialSolution -> Maybe ( Assignment, PartialSolution, Term )
findPreviousSatisfier satisfier incompat (PartialSolution earlierPartial _) =
    let
        incompatDict =
            Incompatibility.asDict incompat

        incompatSatisfierTerm =
            case Dict.get satisfier.package incompatDict of
                -- Not using Maybe.withDefault because Debug.todo crashes
                Nothing ->
                    Debug.todo "shoud exist"

                Just t ->
                    t

        satisfierTerm =
            Assignment.getTerm satisfier.kind

        accumSatisfier =
            Dict.map (\_ _ -> ( False, Term.Negative Range.none )) incompatDict
                |> Dict.insert satisfier.package
                    ( satisfierTerm |> Term.subsetOf incompatSatisfierTerm
                    , satisfierTerm
                    )
    in
    findSatisfierHelper incompatDict accumSatisfier [] (List.reverse earlierPartial)


{-| Iterate over the assignments (oldest must be first)
until we find the first one such that the set of all assignments until this one
satisfies the given incompatibility.
-}
findSatisfierHelper : Dict String Term -> Dict String ( Bool, Term ) -> List Assignment -> List Assignment -> Maybe ( Assignment, PartialSolution, Term )
findSatisfierHelper incompat accumSatisfier accumAssignments newAssignments =
    case newAssignments of
        [] ->
            Nothing

        assignment :: otherAssignments ->
            case Dict.get assignment.package incompat of
                Nothing ->
                    -- We don't care of that assignment if its corresponding package is not in the incompatibility.
                    findSatisfierHelper incompat accumSatisfier (assignment :: accumAssignments) otherAssignments

                Just incompatTerm ->
                    -- If that package corresponds to a package in the incompatibility
                    -- check if it is satisfied with the new assignment.
                    case Dict.get assignment.package accumSatisfier of
                        Nothing ->
                            Debug.todo "A key in incompat should always exist in accumAssignments"

                        Just ( True, _ ) ->
                            -- package term is already satisfied, no need to check
                            findSatisfierHelper incompat accumSatisfier (assignment :: accumAssignments) otherAssignments

                        Just ( False, accumTerm ) ->
                            -- check if the addition of the new term helps satisfying
                            let
                                newAccumTerm =
                                    Term.intersection (Assignment.getTerm assignment.kind) accumTerm

                                termSatisfied =
                                    newAccumTerm
                                        |> Term.subsetOf incompatTerm

                                newAccumSatisfier =
                                    Dict.insert assignment.package ( termSatisfied, newAccumTerm ) accumSatisfier

                                foundSatisfier =
                                    Utils.dictAll (\_ ( satisfied, _ ) -> satisfied) newAccumSatisfier

                                newAccumAssignment =
                                    assignment :: accumAssignments
                            in
                            if foundSatisfier then
                                Just ( assignment, fromAssignements newAccumAssignment, incompatTerm )

                            else
                                findSatisfierHelper incompat newAccumSatisfier newAccumAssignment otherAssignments



-- Final solution


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
solution : PartialSolution -> Maybe (List ( String, Version ))
solution (PartialSolution _ memory) =
    Memory.solution memory
