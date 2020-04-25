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


unitPropagation : String -> String -> List Incompatibility -> PartialSolution -> ()
unitPropagation root name incompatibities partial =
    unitPropagationLoop root (Set.singleton name) incompatibities partial


unitPropagationLoop : String -> Set String -> List Incompatibility -> PartialSolution -> ()
unitPropagationLoop root changed incompatibities partial =
    case Set.toList changed of
        [] ->
            Debug.todo "finish unitPropagationLoop"

        package :: othersChanged ->
            -- TODO: tail rec
            checkIncompatibilities root package othersChanged incompatibities partial


checkIncompatibilities : String -> String -> List String -> List Incompatibility -> PartialSolution -> ()
checkIncompatibilities root package othersChanged incompatibities partial =
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
                                { name = name
                                , term = term
                                , decisionLevel = Debug.todo "decisionLevel"
                                , kind = Assignment.Derivation { cause = incompat }
                                }

                            updatedPartial =
                                derivation :: partial

                            newChanged =
                                name :: othersChanged
                        in
                        checkIncompatibilities root package newChanged othersIncompat updatedPartial

                    _ ->
                        checkIncompatibilities root package othersChanged othersIncompat partial

            else
                checkIncompatibilities root package othersChanged othersIncompat partial


conflictResolution : String -> Incompatibility -> PartialSolution -> Result String ( PartialSolution, Incompatibility )
conflictResolution root incompat partial =
    if Dict.isEmpty incompat then
        Err reportError

    else if Dict.size incompat == 1 then
        case Dict.toList incompat of
            ( name, Term.Positive term ) :: [] ->
                if name == root then
                    Err reportError

                else
                    -- TODO: tail rec
                    continueResolution incompat partial

            _ ->
                Err "Not possible"

    else
        continueResolution incompat partial


reportError : String
reportError =
    "The root package can't be selected, version solving has failed"


continueResolution : Incompatibility -> PartialSolution -> Result String ( PartialSolution, Incompatibility )
continueResolution incompat partial =
    let
        ( satisfier, earlierPartial, term ) =
            PartialSolution.findSatisfier incompat partial

        maybePreviousSatisfier =
            PartialSolution.findPreviousSatisfier satisfier incompat earlierPartial

        previousSatisfierLevel =
            Maybe.map (\( a, _, _ ) -> a.decisionLevel) maybePreviousSatisfier
                |> Maybe.withDefault 1
    in
    if Debug.todo "satisfier is a decision or previousSatisfierLevel /= satisfier level" then
        let
            () =
                Debug.todo "if incompat /= original input, add to solver icompats set"

            () =
                Debug.todo "remove from partial all assignments with decision level > previousSatisfierLevel"
        in
        Debug.todo "return incompatibility"

    else
        let
            priorCause =
                Debug.todo "union of incompat and satisfier's cause minus terms referring to satisfier's package"
        in
        if Debug.todo "satisfier does not satisfy term" then
            Debug.todo "add `not (satisfier - term)` to priorCause. Then set incompat to priorCause"

        else
            Debug.todo "set incompat to priorCause"
