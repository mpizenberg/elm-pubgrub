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


conflictResolution : Bool -> String -> Incompatibility -> List Incompatibility -> PartialSolution -> Result String ( PartialSolution, Incompatibility, List Incompatibility )
conflictResolution incompatChanged root incompat allIncompats partial =
    if Dict.isEmpty incompat then
        Err reportError

    else if Dict.size incompat == 1 then
        case Dict.toList incompat of
            ( name, Term.Positive term ) :: [] ->
                if name == root then
                    Err reportError

                else
                    -- TODO: tail rec
                    continueResolution incompatChanged root incompat allIncompats partial

            _ ->
                Err "Not possible"

    else
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
                    -- add `not (satisfier - term)` to priorCause. Then set incompat to priorCause
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
