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


type alias Model =
    { incompatibilities : List Incompatibility
    , partialSolution : PartialSolution
    }


init : String -> Version -> Model
init root version =
    { incompatibilities = [ Dict.singleton root (Term.Negative (Range.exact version)) ]
    , partialSolution = []
    }


setIncompatibilities : List Incompatibility -> Model -> Model
setIncompatibilities incompatibilities model =
    { incompatibilities = incompatibilities
    , partialSolution = model.partialSolution
    }


setPartialSolution : PartialSolution -> Model -> Model
setPartialSolution partialSolution model =
    { incompatibilities = model.incompatibilities
    , partialSolution = partialSolution
    }


updateIncompatibilities : (List Incompatibility -> List Incompatibility) -> Model -> Model
updateIncompatibilities f { incompatibilities, partialSolution } =
    { incompatibilities = f incompatibilities
    , partialSolution = partialSolution
    }


updatePartialSolution : (PartialSolution -> PartialSolution) -> Model -> Model
updatePartialSolution f { incompatibilities, partialSolution } =
    { incompatibilities = incompatibilities
    , partialSolution = f partialSolution
    }



-- PubGrub algorithm


solve : String -> Version -> Result String (List { name : String, version : Version })
solve root version =
    solveRec root root (init root version)


solveRec : String -> String -> Model -> Result String (List { name : String, version : Version })
solveRec root package model =
    case unitPropagation root package model of
        Err msg ->
            Err msg

        Ok updatedModel ->
            case makeDecision Stub.listAvailableVersions updatedModel of
                Nothing ->
                    if PartialSolution.isSolution updatedModel.partialSolution then
                        Ok (List.filterMap Assignment.finalDecision updatedModel.partialSolution)

                    else
                        Err "Is this possible???"

                Just ( next, updatedAgainModel ) ->
                    solveRec root next updatedAgainModel


makeDecision : (String -> List Version) -> Model -> Maybe ( String, Model )
makeDecision listAvailableVersions model =
    case pickPackageVersion model.partialSolution listAvailableVersions of
        Nothing ->
            Nothing

        Just (Err ( name, incompat )) ->
            Just ( name, updateIncompatibilities (Incompatibility.merge incompat) model )

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

                _ =
                    Debug.log "Add the following incompatibilities" ""

                _ =
                    depIncompats
                        |> List.map (\i -> Debug.log ("  " ++ Incompatibility.toDebugString 0 i) "")

                updatedIncompatibilities =
                    List.foldr Incompatibility.merge model.incompatibilities depIncompats
            in
            case PartialSolution.canAddVersion name version depIncompats model.partialSolution of
                ( False, _ ) ->
                    Just ( name, setIncompatibilities updatedIncompatibilities model )

                ( True, updatedPartial ) ->
                    Just ( name, Model updatedIncompatibilities updatedPartial )


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
            if Dict.member package incompat then
                case Incompatibility.relation incompat (PartialSolution.toDict model.partialSolution) of
                    Incompatibility.Satisfies ->
                        case conflictResolution False root incompat model of
                            Err msg ->
                                Err msg

                            Ok ( priorCause, updatedModel ) ->
                                -- priorCause is guaranted to be almost satisfied by the partial solution
                                case Incompatibility.relation priorCause (PartialSolution.toDict updatedModel.partialSolution) of
                                    Incompatibility.AlmostSatisfies name term ->
                                        let
                                            -- add (not term) to partial solution with incompat as cause
                                            updatedAgainModel =
                                                updatePartialSolution (PartialSolution.prependDerivation name (Term.negate term) priorCause) updatedModel
                                        in
                                        -- Replace changed with a set containing only term's package name.
                                        -- Would love to use the |> syntax if it would not break tail call optimization (TCO).
                                        unitPropagationLoop root package [ name ] othersIncompat updatedAgainModel

                                    _ ->
                                        Err "This should never happen, priorCause is guaranted to be almost satisfied by the partial solution"

                    Incompatibility.AlmostSatisfies name term ->
                        let
                            updatedModel =
                                -- derivation :: partial
                                updatePartialSolution (PartialSolution.prependDerivation name (Term.negate term) incompat) model
                        in
                        -- Would love to use the |> syntax if it didn't break TCO.
                        unitPropagationLoop root package (name :: changed) othersIncompat updatedModel

                    _ ->
                        unitPropagationLoop root package changed othersIncompat model

            else
                unitPropagationLoop root package changed othersIncompat model


{-| Return prior cause and the updated model.
-}
conflictResolution : Bool -> String -> Incompatibility -> Model -> Result String ( Incompatibility, Model )
conflictResolution incompatChanged root incompat model =
    if Dict.isEmpty incompat then
        Err reportError

    else if Dict.size incompat == 1 then
        case Dict.toList incompat of
            ( name, Term.Positive _ ) :: [] ->
                if name == root then
                    Err reportError

                else
                    -- TODO: tail rec
                    continueResolution incompatChanged root incompat model

            _ ->
                continueResolution incompatChanged root incompat model

    else
        -- TODO: tail rec
        continueResolution incompatChanged root incompat model


reportError : String
reportError =
    "The root package can't be selected, version solving has failed"


continueResolution : Bool -> String -> Incompatibility -> Model -> Result String ( Incompatibility, Model )
continueResolution incompatChanged root incompat model =
    let
        ( satisfier, earlierPartial, term ) =
            PartialSolution.findSatisfier incompat model.partialSolution

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
        Assignment.Decision _ ->
            Ok (backtrack incompatChanged previousSatisfierLevel incompat model)

        Assignment.Derivation satisfierTerm { cause } ->
            if previousSatisfierLevel /= satisfier.decisionLevel then
                Ok (backtrack incompatChanged previousSatisfierLevel incompat model)

            else
                let
                    priorCause =
                        -- "priorCause is guaranted to be almost satisfied by the partial solution"
                        Incompatibility.priorCause satisfier.name cause incompat
                in
                -- if satisfier does not satisfy term
                if not (Term.satisfies term [ satisfierTerm ]) then
                    -- add `not (satisfier \ term)` to priorCause. Then set incompat to priorCause
                    -- satisfier \ term  ===  intersection satisfier (not term)
                    -- not (...)  ===  union (not satisfier) (term)
                    let
                        derived =
                            Term.union term (Term.negate satisfierTerm)

                        newIncompat =
                            Incompatibility.termUnion satisfier.name derived priorCause
                    in
                    -- set incompat to newIncompat
                    -- TODO: tail rec
                    conflictResolution True root newIncompat model

                else
                    -- set incompat to priorCause
                    -- TODO: tail rec
                    conflictResolution True root priorCause model


backtrack : Bool -> Int -> Incompatibility -> Model -> ( Incompatibility, Model )
backtrack incompatChanged previousSatisfierLevel incompat model =
    ( incompat
    , { partialSolution = PartialSolution.dropUntilLevel previousSatisfierLevel model.partialSolution
      , incompatibilities =
            if incompatChanged then
                incompat :: model.incompatibilities

            else
                model.incompatibilities
      }
    )
