module PartialSolution exposing (PartialSolution, dropUntilLevel, findPreviousSatisfier, findSatisfier, isSolution, toDict)

import Assignment exposing (Assignment)
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility)
import Term exposing (Term)
import Utils exposing (SearchDecision(..))


type alias PartialSolution =
    List Assignment


toDict : PartialSolution -> Dict String (List Term)
toDict partial =
    List.foldr addAssignment Dict.empty partial


addAssignment : Assignment -> Dict String (List Term) -> Dict String (List Term)
addAssignment assignment allTerms =
    Dict.update assignment.name (addTerm assignment.term) allTerms


addTerm : Term -> Maybe (List Term) -> Maybe (List Term)
addTerm term maybeTerms =
    case maybeTerms of
        Nothing ->
            Just [ term ]

        Just otherTerms ->
            Just (term :: otherTerms)


dropUntilLevel : Int -> PartialSolution -> PartialSolution
dropUntilLevel level partial =
    case partial of
        [] ->
            []

        assignment :: others ->
            if assignment.decisionLevel > level then
                dropUntilLevel level others

            else
                partial


findSatisfier : Incompatibility -> PartialSolution -> ( Assignment, PartialSolution, Term )
findSatisfier incompat partial =
    Utils.find (searchSatisfier incompat) partial
        |> Maybe.withDefault (Debug.todo "should always find something")


findPreviousSatisfier : Assignment -> Incompatibility -> PartialSolution -> Maybe ( Assignment, PartialSolution, Term )
findPreviousSatisfier satisfier incompat earlierPartial =
    Utils.find (searchPreviousSatisfier satisfier incompat) earlierPartial


{-| Earliest assignment in the partial solution before satisfier
such that incompatibility is satisfied by the partial solution up to
and including that assignment plus satisfier.
-}
searchPreviousSatisfier : Assignment -> Incompatibility -> { left : Int, right : Int } -> Assignment -> List Assignment -> SearchDecision ( Assignment, PartialSolution, Term )
searchPreviousSatisfier satisfier incompat sides assignment earlierAssignments =
    searchSatisfier incompat sides assignment (satisfier :: earlierAssignments)


{-| A satisfier is the earliest assignment in partial solution such that the incompatibility
is satisfied by the partial solution up to and including that assignment.
Also returns all assignments earlier than the satisfier.
We call the term in the incompatibility that refers to the same package "term".
-}
searchSatisfier : Incompatibility -> { left : Int, right : Int } -> Assignment -> List Assignment -> SearchDecision ( Assignment, PartialSolution, Term )
searchSatisfier incompat { left, right } assignment earlierAssignments =
    let
        partial =
            assignment :: earlierAssignments
    in
    case Incompatibility.relation incompat (toDict partial) of
        -- if it satisfies, search right (earlier assignments)
        Incompatibility.Satisfies ->
            if right == 0 then
                Found <|
                    ( assignment
                    , earlierAssignments
                    , Dict.get assignment.name incompat
                        |> Maybe.withDefault (Debug.todo "term should exist")
                    )

            else
                KeepGoRight (max 1 (right // 2))

        -- if it does not satisfy, search left (later assignments)
        _ ->
            if left == 0 then
                Stop

            else
                GoLeft (max 1 (left // 2))


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
isSolution : PartialSolution -> Bool
isSolution partial =
    case partial of
        [] ->
            True

        assignment :: others ->
            case assignment.kind of
                Assignment.Decision ->
                    isSolution others

                Assignment.Derivation _ ->
                    case assignment.term of
                        Term.Negative _ ->
                            isSolution others

                        Term.Positive _ ->
                            -- BEWARE, not tail recursive
                            Term.satisfies assignment.term (decision assignment.name others) && isSolution others


decision : String -> PartialSolution -> List Term
decision searchedName partial =
    case partial of
        [] ->
            []

        assignment :: others ->
            case assignment.kind of
                Assignment.Decision ->
                    if assignment.name == searchedName then
                        [ assignment.term ]

                    else
                        decision searchedName others

                _ ->
                    decision searchedName others
