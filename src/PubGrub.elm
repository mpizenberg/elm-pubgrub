module PubGrub exposing (solve)

import Assignment
import Dict
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import Range
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
pickPackage : PartialSolution -> Result ( String, Incompatibility ) ( String, Version )
pickPackage partial =
    Debug.todo "pickPackage"


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
