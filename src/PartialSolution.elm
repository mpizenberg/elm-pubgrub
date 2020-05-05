module PartialSolution exposing (PartialSolution, canAddVersion, dropUntilLevel, encode, findPreviousSatisfier, findSatisfier, isSolution, prependDecision, prependDerivation, splitDecisions, toDebugString, toDict)

import Assignment exposing (Assignment)
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility)
import Json.Encode exposing (Value)
import Range
import Set exposing (Set)
import Term exposing (Term)
import Utils exposing (SearchDecision(..))
import Version exposing (Version)


{-| Both the "List Assignment" form and the "Dict String (List Term)" form
are quite useful for some parts of the pubgrub algorithm.
Maybe a custom opaque type with both forms would provide performance benefits.
This could be fun to benchmark :)
-}
type alias PartialSolution =
    List Assignment



-- Debug


toDebugString : PartialSolution -> String
toDebugString partial =
    Json.Encode.encode 2 (encode partial)


encode : PartialSolution -> Value
encode partial =
    Json.Encode.list Assignment.encodeDebug partial



-- Functions


splitDecisions : PartialSolution -> ( Set String, Dict String (List Term) ) -> ( Set String, Dict String (List Term) )
splitDecisions partial ( decisions, derivations ) =
    case partial of
        [] ->
            ( decisions, derivations )

        assignment :: others ->
            case assignment.kind of
                Assignment.Decision _ ->
                    splitDecisions others ( Set.insert assignment.name decisions, derivations )

                Assignment.Derivation term _ ->
                    splitDecisions others ( decisions, Dict.update assignment.name (Just << (::) term << Maybe.withDefault []) derivations )


{-| We can add the version to the partial solution as a decision
if it doesn't produce any conflict with the new incompatibilities.
In practice I think it can only produce a conflict if one of the dependencies
(which are used to make the new incompatibilities)
is already in the partial solution with an incompatible version.
-}
canAddVersion : String -> Version -> List Incompatibility -> PartialSolution -> ( Bool, PartialSolution )
canAddVersion name version newIncompatibilities partial =
    let
        updatedPartial =
            prependDecision name version partial
    in
    ( doesNotSatisfy newIncompatibilities (toDict updatedPartial), updatedPartial )


doesNotSatisfy : List Incompatibility -> Dict String (List Term) -> Bool
doesNotSatisfy newIncompatibilities partial =
    case newIncompatibilities of
        [] ->
            True

        incompat :: others ->
            case Incompatibility.relation incompat partial of
                Incompatibility.Satisfies ->
                    False

                _ ->
                    doesNotSatisfy others partial


prependDecision : String -> Version -> PartialSolution -> PartialSolution
prependDecision name version partial =
    case partial of
        [] ->
            [ Assignment.newDecision name version 0 ]

        { decisionLevel } :: _ ->
            let
                _ =
                    Debug.log ("Decision level " ++ String.fromInt decisionLevel ++ " : " ++ name ++ " : " ++ Version.toDebugString version) ""
            in
            Assignment.newDecision name version (decisionLevel + 1) :: partial


prependDerivation : String -> Term -> Incompatibility -> PartialSolution -> PartialSolution
prependDerivation name term cause partial =
    case partial of
        [] ->
            [ Assignment.newDerivation name term 0 cause ]

        { decisionLevel } :: _ ->
            let
                _ =
                    Debug.log ("Derivation : " ++ name ++ " : " ++ Term.toDebugString term) ""
            in
            Assignment.newDerivation name term decisionLevel cause :: partial


toDict : PartialSolution -> Dict String (List Term)
toDict partial =
    List.foldr addAssignment Dict.empty partial


addAssignment : Assignment -> Dict String (List Term) -> Dict String (List Term)
addAssignment assignment allTerms =
    Dict.update assignment.name (addTerm assignment) allTerms


addTerm : Assignment -> Maybe (List Term) -> Maybe (List Term)
addTerm assignment maybeTerms =
    case maybeTerms of
        Nothing ->
            Just [ Assignment.getTerm assignment.kind ]

        Just otherTerms ->
            Just (Assignment.getTerm assignment.kind :: otherTerms)


dropUntilLevel : Int -> PartialSolution -> PartialSolution
dropUntilLevel level partial =
    case partial of
        [] ->
            []

        assignment :: others ->
            if assignment.decisionLevel > level then
                dropUntilLevel level others

            else
                let
                    _ =
                        Debug.log ("Backtrack partial solution to:\n" ++ toDebugString partial) ""
                in
                partial


findSatisfier : Incompatibility -> PartialSolution -> ( Assignment, PartialSolution, Term )
findSatisfier incompat partial =
    case Utils.find (searchSatisfier incompat (::)) partial of
        Just x ->
            x

        Nothing ->
            Debug.todo "should always find something"


{-| Earliest assignment in the partial solution before satisfier
such that incompatibility is satisfied by the partial solution up to
and including that assignment plus satisfier.
-}
findPreviousSatisfier : Assignment -> Incompatibility -> PartialSolution -> Maybe ( Assignment, PartialSolution, Term )
findPreviousSatisfier satisfier incompat earlierPartial =
    Utils.find (searchSatisfier incompat (\assign earlier -> satisfier :: assign :: earlier)) earlierPartial


{-| A satisfier is the earliest assignment in partial solution such that the incompatibility
is satisfied by the partial solution up to and including that assignment.
Also returns all assignments earlier than the satisfier.
We call the term in the incompatibility that refers to the same package "term".
-}
searchSatisfier : Incompatibility -> (Assignment -> List Assignment -> PartialSolution) -> { left : Int, right : Int } -> Assignment -> List Assignment -> SearchDecision ( Assignment, PartialSolution, Term )
searchSatisfier incompat buildPartial { left, right } assignment earlierAssignments =
    let
        partial =
            buildPartial assignment earlierAssignments
    in
    case Incompatibility.relation incompat (toDict partial) of
        -- if it satisfies, search right (earlier assignments)
        Incompatibility.Satisfies ->
            if right == 0 then
                case Dict.get assignment.name (Incompatibility.asDict incompat) of
                    Just term ->
                        Found
                            ( assignment
                            , earlierAssignments
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


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
isSolution : PartialSolution -> Bool
isSolution partial =
    isSolutionRec (List.reverse partial) True


isSolutionRec : PartialSolution -> Bool -> Bool
isSolutionRec partial precondition =
    case ( precondition, partial ) of
        ( False, _ ) ->
            False

        ( True, [] ) ->
            True

        ( True, assignment :: others ) ->
            case assignment.kind of
                Assignment.Decision _ ->
                    isSolutionRec others True

                Assignment.Derivation term _ ->
                    case term of
                        Term.Negative _ ->
                            isSolutionRec others True

                        Term.Positive _ ->
                            isSolutionRec others (Term.satisfies term (getDecision assignment.name others))


getDecision : String -> PartialSolution -> List Term
getDecision searchedName partial =
    case partial of
        [] ->
            []

        assignment :: others ->
            case assignment.kind of
                Assignment.Decision version ->
                    if assignment.name == searchedName then
                        [ Term.Positive (Range.exact version) ]

                    else
                        getDecision searchedName others

                _ ->
                    getDecision searchedName others
