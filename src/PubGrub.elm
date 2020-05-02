module PubGrub exposing (solve)

import Assignment
import Database.Stub as Stub
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import Range exposing (Range)
import Set
import Term exposing (Term)
import Version exposing (Version)


solve : String -> Version -> Result String (List { name : String, version : Version })
solve root version =
    solveRec root root [ init root version ] []


solveRec : String -> String -> List Incompatibility -> PartialSolution -> Result String (List { name : String, version : Version })
solveRec root package allIncompats partial =
    case unitPropagation root (Debug.log "unitPropagation" package) allIncompats partial of
        Err msg ->
            Err msg

        Ok ( updatedPartial, updatedAllIncompats ) ->
            case makeDecision Stub.listAvailableVersions updatedAllIncompats updatedPartial of
                Nothing ->
                    if PartialSolution.isSolution updatedPartial then
                        Ok (List.filterMap Assignment.finalDecision updatedPartial)

                    else
                        Err "Is this possible???"

                Just ( next, updatedAgainAllIncompats, updatedAgainPartial ) ->
                    -- if PartialSolution.isSolution updatedPartial then
                    solveRec root next updatedAgainAllIncompats updatedAgainPartial


init : String -> Version -> Incompatibility
init root version =
    Dict.singleton root (Term.Negative (Range.Exact version))


makeDecision : (String -> List Version) -> List Incompatibility -> PartialSolution -> Maybe ( String, List Incompatibility, PartialSolution )
makeDecision listAvailableVersions allIncompats partial =
    case pickPackageVersion partial listAvailableVersions of
        Nothing ->
            Nothing

        Just (Err ( name, incompat )) ->
            Just ( name, Incompatibility.merge incompat allIncompats, partial )

        Just (Ok ( name, version )) ->
            let
                dependencies =
                    case Stub.getDependencies name version of
                        Just deps ->
                            deps

                        Nothing ->
                            Debug.todo "The name and version should exist"

                depIncompats =
                    Incompatibility.fromDependencies name version dependencies

                updatedAllIncompats =
                    List.foldr Incompatibility.merge allIncompats depIncompats
            in
            case PartialSolution.canAddVersion name version depIncompats partial of
                ( False, _ ) ->
                    Just ( name, updatedAllIncompats, partial )

                ( True, updatedPartial ) ->
                    Just ( name, updatedAllIncompats, updatedPartial )


{-| Heuristic to pick the next package & version to add to the partial solution.
This should be a package with a positive derivation but no decision yet.
If multiple choices are possible, use a heuristic.

Pub chooses the latest matching version of the package
with the fewest versions that match the outstanding constraint.
This tends to find conflicts earlier if any exist,
since these packages will run out of versions to try more quickly.
But there's likely room for improvement in these heuristics.

Let "term" be the intersection of all assignment in the partial solution
referring to that package.
If no version matches that term return an error with
the package name and the incompatibity {term}.

-}
pickPackageVersion : PartialSolution -> (String -> List Version) -> Maybe (Result ( String, Incompatibility ) ( String, Version ))
pickPackageVersion partial listAvailableVersions =
    case pickPackage partial of
        Just ( name, term ) ->
            pickVersion (listAvailableVersions name) term
                |> Maybe.map (Tuple.pair name)
                |> Result.fromMaybe ( name, Dict.singleton name term )
                |> Just

        Nothing ->
            Nothing


{-| Heuristic to pick the next package to add to the partial solution.
This should be a package with a positive derivation but no decision yet.
If multiple choices are possible, use a heuristic.

Pub chooses the package with the fewest versions
matching the outstanding constraint.
This tends to find conflicts earlier if any exist,
since these packages will run out of versions to try more quickly.
But there's likely room for improvement in these heuristics.

Here we just pick the first one.

-}
pickPackage : PartialSolution -> Maybe ( String, Term )
pickPackage partial =
    potentialPackages partial
        |> Dict.toList
        |> List.head
        |> Maybe.map (Tuple.mapSecond (Term.listIntersection Nothing))


potentialPackages : PartialSolution -> Dict String (List Term)
potentialPackages partial =
    let
        -- ( Set String, Dict String (List Term) )
        ( decisions, derivations ) =
            PartialSolution.splitDecisions partial ( Set.empty, Dict.empty )
    in
    Dict.filter (\name terms -> not (Set.member name decisions) && List.any Term.isPositive terms) derivations


{-| Pub chooses the latest matching version of the package
that match the outstanding constraint.

Here we just pick the first one that satisfies the terms.
Its the responsibility of the provider of `availableVersions`
to list them with preferred versions first.

-}
pickVersion : List Version -> Term -> Maybe Version
pickVersion availableVersions partialSolutionTerm =
    case availableVersions of
        [] ->
            Nothing

        v :: others ->
            if Term.acceptVersionJust v partialSolutionTerm then
                Just v

            else
                pickVersion others partialSolutionTerm


getDependencies : String -> Version -> Maybe (List ( String, Range ))
getDependencies package version =
    Debug.todo "Should be implemented lazily"


unitPropagation : String -> String -> List Incompatibility -> PartialSolution -> Result String ( PartialSolution, List Incompatibility )
unitPropagation root package incompatibilities partial =
    unitPropagationLoop root "" [ package ] [] incompatibilities partial


unitPropagationLoop : String -> String -> List String -> List Incompatibility -> List Incompatibility -> PartialSolution -> Result String ( PartialSolution, List Incompatibility )
unitPropagationLoop root package changed loopIncompatibilities allIncompats partial =
    case loopIncompatibilities of
        [] ->
            case changed of
                [] ->
                    Ok ( partial, allIncompats )

                pack :: othersChanged ->
                    unitPropagationLoop root pack othersChanged allIncompats allIncompats partial

        incompat :: othersIncompat ->
            if Dict.member package incompat then
                case Incompatibility.relation incompat (PartialSolution.toDict partial) of
                    Incompatibility.Satisfies ->
                        case conflictResolution False root incompat allIncompats partial of
                            Err msg ->
                                Err msg

                            Ok ( updatedPartial, priorCause, updatedAllIncompats ) ->
                                -- priorCause is guaranted to be almost satisfied by the partial solution
                                case Incompatibility.relation priorCause (PartialSolution.toDict updatedPartial) of
                                    Incompatibility.AlmostSatisfies name term ->
                                        let
                                            -- add not term to partial with incompat as cause
                                            partialWithNotTermInPriorCause =
                                                PartialSolution.prependDerivation name (Term.negate term) priorCause updatedPartial
                                        in
                                        -- Replace changed with a set containing only term's package name.
                                        unitPropagationLoop root package [ name ] othersIncompat updatedAllIncompats partialWithNotTermInPriorCause

                                    _ ->
                                        Err "This should never happen, priorCause is guaranted to be almost satisfied by the partial solution"

                    Incompatibility.AlmostSatisfies name term ->
                        let
                            updatedPartial =
                                -- derivation :: partial
                                PartialSolution.prependDerivation name (Term.negate term) incompat partial
                        in
                        unitPropagationLoop root package (name :: changed) othersIncompat allIncompats updatedPartial

                    _ ->
                        unitPropagationLoop root package changed othersIncompat allIncompats partial

            else
                unitPropagationLoop root package changed othersIncompat allIncompats partial


{-| Returns ( updated partial solution, prior cause, updated list of incompatibilities )
-}
conflictResolution : Bool -> String -> Incompatibility -> List Incompatibility -> PartialSolution -> Result String ( PartialSolution, Incompatibility, List Incompatibility )
conflictResolution incompatChanged root incompat allIncompats partial =
    if Dict.isEmpty incompat then
        Err reportError

    else if Dict.size incompat == 1 then
        case Dict.toList incompat of
            ( name, Term.Positive _ ) :: [] ->
                if name == root then
                    Err reportError

                else
                    -- TODO: tail rec
                    continueResolution incompatChanged root incompat allIncompats partial

            _ ->
                continueResolution incompatChanged root incompat allIncompats partial

    else
        -- TODO: tail rec
        continueResolution incompatChanged root incompat allIncompats partial


reportError : String
reportError =
    "The root package can't be selected, version solving has failed"


continueResolution : Bool -> String -> Incompatibility -> List Incompatibility -> PartialSolution -> Result String ( PartialSolution, Incompatibility, List Incompatibility )
continueResolution incompatChanged root incompat allIncompats partial =
    let
        ( satisfier, earlierPartial, term ) =
            PartialSolution.findSatisfier incompat partial

        maybePreviousSatisfier =
            PartialSolution.findPreviousSatisfier satisfier incompat earlierPartial

        previousSatisfierLevel =
            Maybe.map (\( a, _, _ ) -> a.decisionLevel) maybePreviousSatisfier
                -- TODO: According to PubGrub doc, decision level 1 is the decision level
                -- where root package was selected,
                -- however I see in the examples that the root level corresponds to decision level 0 ...
                -- To be clarified.
                |> Maybe.withDefault 1
    in
    case satisfier.kind of
        -- if satisfier.kind == Assignment.Decision || previousSatisfierLevel /= satisfier.decisionLevel then
        Assignment.Decision ->
            Ok (updateAllIncompatsHelper incompatChanged previousSatisfierLevel incompat allIncompats partial)

        Assignment.Derivation { cause } ->
            if previousSatisfierLevel /= satisfier.decisionLevel then
                Ok (updateAllIncompatsHelper incompatChanged previousSatisfierLevel incompat allIncompats partial)

            else
                let
                    priorCause =
                        Incompatibility.priorCause satisfier.name cause incompat
                in
                -- if satisfier does not satisfy term
                if not (Term.satisfies term [ satisfier.term ]) then
                    -- add `not (satisfier \ term)` to priorCause. Then set incompat to priorCause
                    let
                        derived =
                            Term.union term (Term.negate satisfier.term)

                        newIncompat =
                            Incompatibility.termUnion satisfier.name derived priorCause
                    in
                    -- set incompat to newIncompat
                    -- TODO: tail rec
                    conflictResolution True root newIncompat allIncompats partial

                else
                    -- set incompat to priorCause
                    -- TODO: tail rec
                    conflictResolution True root priorCause allIncompats partial


updateAllIncompatsHelper : Bool -> Int -> Incompatibility -> List Incompatibility -> PartialSolution -> ( PartialSolution, Incompatibility, List Incompatibility )
updateAllIncompatsHelper incompatChanged previousSatisfierLevel incompat allIncompats partial =
    ( PartialSolution.dropUntilLevel previousSatisfierLevel partial
    , incompat
    , if incompatChanged then
        incompat :: allIncompats

      else
        allIncompats
    )
