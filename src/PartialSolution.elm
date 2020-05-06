module PartialSolution exposing (PartialSolution, addVersion, dropUntilLevel, empty, encode, findPreviousSatisfier, findSatisfier, potentialPackages, prependDecision, prependDerivation, relation, solution, toDebugString)

import Assignment exposing (Assignment)
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility, Relation)
import Json.Encode exposing (Value)
import Range
import Term exposing (Term)
import Utils exposing (SearchDecision(..))
import Version exposing (Version)


{-| Both the "List Assignment" form and the "Dict String (List Term)" form
are quite useful for some parts of the pubgrub algorithm.
Maybe a custom opaque type with both forms would provide performance benefits.
This could be fun to benchmark :)

Since Dict are persistent data structures sharing a lot of data,
it may not be so bad to keep a dict of organized terms for each partial solution entry.

-}
type PartialSolution
    = PartialSolution (List ( Assignment, Memory ))


type alias Memory =
    Dict String PackageMemory


type alias PackageMemory =
    { decision : Maybe Version, derivations : List Term }


empty : PartialSolution
empty =
    PartialSolution []


memoryTerms : String -> PackageMemory -> List Term
memoryTerms _ { decision, derivations } =
    case decision of
        Nothing ->
            derivations

        Just version ->
            Term.Positive (Range.exact version) :: derivations



-- Debug


toDebugString : PartialSolution -> String
toDebugString partial =
    Json.Encode.encode 2 (encode partial)


encode : PartialSolution -> Value
encode (PartialSolution partial) =
    Json.Encode.list (Assignment.encodeDebug << Tuple.first) partial



-- Functions


potentialPackages : PartialSolution -> Dict String (List Term)
potentialPackages (PartialSolution partial) =
    case partial of
        [] ->
            Dict.empty

        ( _, memory ) :: _ ->
            Utils.dictFilterMap potentialPackage memory


potentialPackage : String -> { decision : Maybe Version, derivations : List Term } -> Maybe (List Term)
potentialPackage _ { decision, derivations } =
    case decision of
        Just _ ->
            Nothing

        Nothing ->
            if List.any Term.isPositive derivations then
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
            case Incompatibility.relation incompat (Dict.map memoryTerms memory) of
                Incompatibility.Satisfies ->
                    False

                _ ->
                    doesNotSatisfy others (PartialSolution partial)


relation : Incompatibility -> PartialSolution -> Relation
relation incompatibility partial =
    Incompatibility.relation incompatibility (Dict.map memoryTerms (firstMemory partial))


firstMemory : PartialSolution -> Memory
firstMemory (PartialSolution partial) =
    List.head partial
        |> Maybe.map Tuple.second
        |> Maybe.withDefault Dict.empty


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
                    Debug.log ("Decision level " ++ String.fromInt decisionLevel ++ " : " ++ name ++ " : " ++ Version.toDebugString version) ""

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


addAssignment : Assignment -> Memory -> Memory
addAssignment assignment memory =
    case assignment.kind of
        Assignment.Decision version ->
            Dict.update assignment.name (updateMemoryVersion version) memory

        Assignment.Derivation term _ ->
            Dict.update assignment.name (updateMemoryTerm term) memory


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
    case Incompatibility.relation incompat (Dict.map memoryTerms memory) of
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
