module PubGrub exposing (solve)

import Assignment
import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import Range exposing (Range)
import Set exposing (Set)
import Term exposing (Term)
import Version exposing (Version)


solve : ()
solve =
    let
        next =
            Debug.todo "name of the root package"

        () =
            Debug.todo "unit propagation on next to find new derivations"

        () =
            Debug.todo "if an incompatibity is satisfied, resolve conflict"

        () =
            Debug.todo "in case failure to resolv conflict report an error"

        () =
            Debug.todo "make a decision and set next to that new package name"

        () =
            Debug.todo "if no more work after decision making, we have a solution"
    in
    Debug.todo "solve"


init : String -> Version -> Incompatibility
init root version =
    Dict.singleton root (Term.Negative (Range.Exact version))


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
pickPackageVersion : PartialSolution -> (String -> List Version) -> Result () ()
pickPackageVersion partial listAvailableVersions =
    let
        ( name, terms ) =
            pickPackage partial

        availableVersions =
            listAvailableVersions name

        version =
            pickVersion availableVersions terms

        dependencies =
            Maybe.andThen (getDependencies name) version

        _ =
            Debug.todo "Add incompatibilities obtained from dependencies in to the set of incompatibilities"
    in
    Debug.todo "TODO"


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
pickPackage : PartialSolution -> ( String, List Term )
pickPackage partial =
    potentialPackages partial
        |> Dict.toList
        |> List.head
        |> Maybe.withDefault (Debug.todo "Is it possible that there is no potential package?")


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
pickVersion : List Version -> List Term -> Maybe Version
pickVersion availableVersions partialSolutionTerms =
    case availableVersions of
        [] ->
            Nothing

        v :: others ->
            if Term.contradicts (Term.Positive (Range.Exact v)) partialSolutionTerms then
                pickVersion others partialSolutionTerms

            else
                Just v


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
                                                PartialSolution.prependDerivation name term priorCause updatedPartial
                                        in
                                        -- Replace changed with a set containing only term's package name.
                                        unitPropagationLoop root package [ name ] othersIncompat updatedAllIncompats partialWithNotTermInPriorCause

                                    _ ->
                                        Err "This should never happen, priorCause is guaranted to be almost satisfied by the partial solution"

                    Incompatibility.AlmostSatisfies name term ->
                        let
                            updatedPartial =
                                -- derivation :: partial
                                PartialSolution.prependDerivation name term incompat partial
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
                Err "Not possible"

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
