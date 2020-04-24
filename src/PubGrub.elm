module PubGrub exposing (solve)

import Dict
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import Range
import Set exposing (Set)
import Term
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


unitPropagation : String -> List Incompatibility -> PartialSolution -> ()
unitPropagation name incompatibities partial =
    unitPropagationLoop (Set.singleton name) incompatibities partial


unitPropagationLoop : Set String -> List Incompatibility -> PartialSolution -> ()
unitPropagationLoop changed incompatibities partial =
    case Set.toList changed of
        [] ->
            Debug.todo "finish unitPropagationLoop"

        package :: othersChanged ->
            -- TODO: tail rec
            checkIncompatibilities package othersChanged incompatibities partial


checkIncompatibilities : String -> List String -> List Incompatibility -> PartialSolution -> ()
checkIncompatibilities package othersChanged incompatibities partial =
    case incompatibities of
        [] ->
            Debug.todo "finish checkIncompatibilities"

        incompat :: othersIncompat ->
            if Dict.member package incompat then
                case Incompatibility.relation incompat (PartialSolution.toDict partial) of
                    Incompatibility.Satisfies ->
                        let
                            () =
                                Debug.todo "conflic resolution with incompatibility"

                            () =
                                Debug.todo "add not term to partial with incompat as cause"

                            () =
                                Debug.todo "replace changed with Set.singleton term.name"
                        in
                        ()

                    Incompatibility.AlmostSatisfies name term ->
                        let
                            derivation =
                                PartialSolution.Derivation
                                    { decisionLevel = Debug.todo "decisionLevel"
                                    , cause = incompat
                                    , name = name
                                    , term = term
                                    }

                            updatedPartial =
                                derivation :: partial

                            newChanged =
                                name :: othersChanged
                        in
                        checkIncompatibilities package newChanged othersIncompat updatedPartial

                    _ ->
                        checkIncompatibilities package othersChanged othersIncompat partial

            else
                checkIncompatibilities package othersChanged othersIncompat partial


conflictResolution : ()
conflictResolution =
    Debug.todo "conflictResolution"
