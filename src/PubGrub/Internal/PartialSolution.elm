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
import PubGrub.Version as Version exposing (Version)
import Utils exposing (SearchDecision(..))


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
doesNotSatisfy newIncompatibilities (PartialSolution partial) =
    case ( newIncompatibilities, partial ) of
        ( _, [] ) ->
            True

        ( [], _ ) ->
            True

        ( incompat :: others, ( _, memory ) :: _ ) ->
            case Incompatibility.relation (Memory.terms memory) incompat of
                Incompatibility.Satisfies ->
                    False

                _ ->
                    doesNotSatisfy others (PartialSolution partial)


{-| Check if the terms in the partial solution
satisfy the incompatibility.
-}
relation : Incompatibility -> PartialSolution -> Relation
relation incompatibility (PartialSolution partial) =
    case partial of
        [] ->
            Incompatibility.relation Dict.empty incompatibility

        ( _, memory ) :: _ ->
            Incompatibility.relation (Memory.terms memory) incompatibility


{-| Prepend a decision (a package with a version)
to the partial solution.
-}
prependDecision : String -> Version -> PartialSolution -> PartialSolution
prependDecision package version (PartialSolution partial) =
    case partial of
        [] ->
            PartialSolution
                [ ( Assignment.newDecision package version 0
                  , Dict.singleton package { decision = Just version, derivations = [] }
                  )
                ]

        ( { decisionLevel }, memory ) :: _ ->
            let
                _ =
                    Debug.log ("Decision level " ++ String.fromInt (decisionLevel + 1) ++ " : " ++ package ++ " : " ++ Version.toDebugString version) ""

                decision =
                    Assignment.newDecision package version (decisionLevel + 1)

                newMemory =
                    Memory.addDecision package version memory
            in
            PartialSolution (( decision, newMemory ) :: partial)


{-| Prepend a package derivation term to the partial solution.
Also includes its cause.
-}
prependDerivation : String -> Term -> Incompatibility -> PartialSolution -> PartialSolution
prependDerivation package term cause (PartialSolution partial) =
    case partial of
        [] ->
            PartialSolution
                [ ( Assignment.newDerivation package term 0 cause
                  , Dict.singleton package { decision = Nothing, derivations = [ term ] }
                  )
                ]

        ( { decisionLevel }, memory ) :: _ ->
            let
                _ =
                    Debug.log ("Derivation : " ++ package ++ " : " ++ Term.toDebugString term) ""

                derivation =
                    Assignment.newDerivation package term decisionLevel cause

                newMemory =
                    Memory.addDerivation package term memory
            in
            PartialSolution (( derivation, newMemory ) :: partial)


{-| Backtrack the partial solution to a given decision level.
-}
backtrack : Int -> PartialSolution -> PartialSolution
backtrack level (PartialSolution partial) =
    let
        _ =
            Debug.log "backtrack to level" level
    in
    PartialSolution (dropUntilLevel level partial)


dropUntilLevel : Int -> List ( Assignment, m ) -> List ( Assignment, m )
dropUntilLevel level partial =
    case partial of
        [] ->
            []

        ( { decisionLevel }, _ ) :: others ->
            if decisionLevel > level then
                dropUntilLevel level others

            else
                partial


{-| A satisfier is the earliest assignment in partial solution such that the incompatibility
is satisfied by the partial solution up to and including that assignment.
Also returns all assignments earlier than the satisfier.
We call the term in the incompatibility that refers to the same package "term".
-}
findSatisfier : Incompatibility -> PartialSolution -> ( Assignment, PartialSolution, Term )
findSatisfier incompat (PartialSolution partial) =
    case Utils.find (searchSatisfier incompat Memory.addAssignment) partial of
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
            Memory.addAssignment satisfier (Memory.addAssignment assignment earlierMemory)
    in
    Utils.find (searchSatisfier incompat buildMemory) earlierPartial


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
    case Incompatibility.relation (Memory.terms memory) incompat of
        -- if it satisfies, search right (earlier assignments)
        Incompatibility.Satisfies ->
            if right == 0 then
                case Dict.get assignment.package (Incompatibility.asDict incompat) of
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
            Memory.solution memory
