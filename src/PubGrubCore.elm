module PubGrubCore exposing
    ( Model
    , init, setIncompatibilities, mapIncompatibilities
    , pickPackage, pickVersion, unitPropagation
    )

{-| PubGrub version solving algorithm.

PubGrub is a version solving algorithm,
written in 2018 by Natalie Weizenbaum
for the Dart package manager.
It is supposed to be very fast and to explain errors
more clearly than the alternatives.
An introductory blog post was
[published on Medium][medium-pubgrub] by its author.

The detailed explanation of the algorithm is
[provided on GitHub][github-pubgrub].
The foundation of the algorithm is based on ASP (Answer Set Programming)
and a book called
"[Answer Set Solving in Practice][potassco-book]"
by Martin Gebser, Roland Kaminski, Benjamin Kaufmann and Torsten Schaub.

[medium-pubgrub]: https://medium.com/@nex3/pubgrub-2fb6470504f
[github-pubgrub]: https://github.com/dart-lang/pub/blob/master/doc/solver.md
[potassco-book]: https://potassco.org/book/

This module contains the core model and functions
to write a functional PubGrub algorithm.

@docs Model

@docs init, setIncompatibilities, mapIncompatibilities

@docs pickPackage, pickVersion, unitPropagation

-}

import Assignment
import Dict
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import Report
import Term exposing (Term)
import Version exposing (Version)


{-| PubGrub model.
-}
type alias Model =
    { incompatibilities : List Incompatibility
    , partialSolution : PartialSolution
    }


{-| PubGrub init.
-}
init : String -> Version -> Model
init root version =
    { incompatibilities = [ Incompatibility.notRoot root version ]
    , partialSolution = PartialSolution.empty
    }


{-| PubGrub setIncompatibilities.
-}
setIncompatibilities : List Incompatibility -> Model -> Model
setIncompatibilities incompatibilities model =
    { incompatibilities = incompatibilities
    , partialSolution = model.partialSolution
    }


{-| PubGrub mapIncompatibilities.
-}
mapIncompatibilities : (List Incompatibility -> List Incompatibility) -> Model -> Model
mapIncompatibilities f { incompatibilities, partialSolution } =
    { incompatibilities = f incompatibilities
    , partialSolution = partialSolution
    }


mapPartialSolution : (PartialSolution -> PartialSolution) -> Model -> Model
mapPartialSolution f { incompatibilities, partialSolution } =
    { incompatibilities = incompatibilities
    , partialSolution = f partialSolution
    }


{-| Heuristic to pick the next package to add to the partial solution.
This should be a package with a positive derivation but no decision yet.
If multiple choices are possible, use a heuristic.

Pub chooses the package with the fewest versions
matching the outstanding constraint.
This tends to find conflicts earlier if any exist,
since these packages will run out of versions to try more quickly.
But there's likely room for improvement in these heuristics.

Here we just pick the first one.
TODO: improve?

-}
pickPackage : PartialSolution -> Maybe ( String, Term )
pickPackage partial =
    PartialSolution.potentialPackages partial
        |> Dict.toList
        |> List.head
        |> Maybe.map (Tuple.mapSecond (Term.listIntersection Nothing))


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


{-| Unit propagation is the core mechanism of the solving algorithm.
-}
unitPropagation : String -> String -> Model -> Result String Model
unitPropagation root package model =
    unitPropagationLoop root "" [ package ] [] model


unitPropagationLoop : String -> String -> List String -> List Incompatibility -> Model -> Result String Model
unitPropagationLoop root package changed loopIncompatibilities model =
    case loopIncompatibilities of
        [] ->
            case changed of
                [] ->
                    Ok model

                pack :: othersChanged ->
                    unitPropagationLoop root pack othersChanged model.incompatibilities model

        incompat :: othersIncompat ->
            if Dict.member package (Incompatibility.asDict incompat) then
                case PartialSolution.relation incompat model.partialSolution of
                    Incompatibility.Satisfies ->
                        case conflictResolution False root incompat model of
                            Err msg ->
                                Err msg

                            Ok ( rootCause, updatedModel ) ->
                                -- rootCause is guaranted to be almost satisfied by the partial solution
                                case PartialSolution.relation rootCause updatedModel.partialSolution of
                                    Incompatibility.AlmostSatisfies name term ->
                                        let
                                            -- add (not term) to partial solution with incompat as cause
                                            updatedAgainModel =
                                                mapPartialSolution (PartialSolution.prependDerivation name (Term.negate term) rootCause) updatedModel
                                        in
                                        -- Replace changed with a set containing only term's package name.
                                        -- Would love to use the |> syntax if it would not break tail call optimization (TCO).
                                        unitPropagationLoop root package [ name ] othersIncompat updatedAgainModel

                                    _ ->
                                        Err "This should never happen, rootCause is guaranted to be almost satisfied by the partial solution"

                    Incompatibility.AlmostSatisfies name term ->
                        let
                            updatedModel =
                                -- derivation :: partial
                                mapPartialSolution (PartialSolution.prependDerivation name (Term.negate term) incompat) model
                        in
                        -- Would love to use the |> syntax if it didn't break TCO.
                        unitPropagationLoop root package (name :: changed) othersIncompat updatedModel

                    _ ->
                        unitPropagationLoop root package changed othersIncompat model

            else
                unitPropagationLoop root package changed othersIncompat model


{-| Return the root cause and the backtracked model.
-}
conflictResolution : Bool -> String -> Incompatibility -> Model -> Result String ( Incompatibility, Model )
conflictResolution incompatChanged root incompat model =
    if Incompatibility.isTerminal root incompat then
        let
            _ =
                Debug.log ("Final incompatibility:\n" ++ Incompatibility.toDebugString -1 3 incompat) ""

            _ =
                Debug.log "Model incompatibilities:" ""

            _ =
                List.map (\i -> Debug.log (Incompatibility.toDebugString 1 3 i) "") model.incompatibilities

            _ =
                Debug.log ("Model partial solution:" ++ PartialSolution.toDebugString model.partialSolution) ""

            explanation =
                Report.generate (Incompatibility.toReportTree incompat)

            _ =
                Debug.log ("Textual explanation:\n" ++ explanation) ""
        in
        Err reportError

    else
        let
            ( satisfier, earlierPartial, term ) =
                PartialSolution.findSatisfier incompat model.partialSolution

            maybePreviousSatisfier =
                PartialSolution.findPreviousSatisfier satisfier incompat earlierPartial

            previousSatisfierLevel =
                Maybe.map (\( a, _, _ ) -> a.decisionLevel) maybePreviousSatisfier
                    |> Maybe.map (max 1)
                    |> Maybe.withDefault 1
        in
        case satisfier.kind of
            -- if satisfier.kind == Assignment.Decision || previousSatisfierLevel /= satisfier.decisionLevel then
            Assignment.Decision _ ->
                Ok ( incompat, backtrack incompatChanged previousSatisfierLevel incompat model )

            Assignment.Derivation satisfierTerm { cause } ->
                if previousSatisfierLevel /= satisfier.decisionLevel then
                    let
                        _ =
                            Debug.log "previousLevel /= satisfierLevel" ""

                        _ =
                            Debug.log (Incompatibility.toDebugString -1 3 incompat) ""
                    in
                    Ok ( incompat, backtrack incompatChanged previousSatisfierLevel incompat model )

                else
                    let
                        _ =
                            Debug.log "previousLevel == satisfierLevel" ""

                        _ =
                            Debug.log ("   satisfier " ++ satisfier.package ++ " " ++ Term.toDebugString satisfierTerm) ""

                        _ =
                            Debug.log ("   cause\n" ++ Incompatibility.toDebugString -1 6 cause) ""

                        _ =
                            Debug.log ("   incompat\n" ++ Incompatibility.toDebugString -1 6 incompat) ""

                        priorCause =
                            Incompatibility.priorCause cause incompat

                        _ =
                            Debug.log ("   priorCause\n" ++ Incompatibility.toDebugString -1 3 priorCause) ""
                    in
                    conflictResolution True root priorCause model


reportError : String
reportError =
    "The root package can't be selected, version solving has failed"


backtrack : Bool -> Int -> Incompatibility -> Model -> Model
backtrack incompatChanged previousSatisfierLevel rootCause model =
    { partialSolution = PartialSolution.backtrack previousSatisfierLevel model.partialSolution
    , incompatibilities =
        if incompatChanged then
            let
                _ =
                    Debug.log ("Add root cause incompatibility:\n" ++ Incompatibility.toDebugString -1 3 rootCause) ""
            in
            Incompatibility.merge rootCause model.incompatibilities

        else
            model.incompatibilities
    }
