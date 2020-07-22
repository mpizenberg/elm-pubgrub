module PubGrub.Memory exposing
    ( Memory, PackageAssignments
    , fromDecision, fromDerivation, addAssignment, addDecision, addDerivation
    , terms
    , potentialPackages, solution
    )

{-| A Memory acts like a structured partial solution
where terms are regrouped by package in a dictionary.
This module provides functions to manage it.

@docs Memory, PackageAssignments


# Building a Memory

@docs fromDecision, fromDerivation, addAssignment, addDecision, addDerivation


# Retrieving terms in a Memory

@docs terms


# Finding a solution

@docs potentialPackages, solution

-}

import Dict exposing (Dict)
import PubGrub.Assignment as Assignment exposing (Assignment)
import PubGrub.Range as Range
import PubGrub.Term as Term exposing (Term)
import PubGrub.Version exposing (Version)
import Utils exposing (SearchDecision(..))


{-| Memory is the set of all assignments previous to (including)
its paired assignment in the partial solution list.

Those previous assignments are regrouped by package,
making it easier to find out if a decision was made for a given package,
and to list all corresponding derivations of a package.

Contrary to PartialSolution, Memory does not store derivations causes,
only the terms.

-}
type alias Memory =
    Dict String PackageAssignments


{-| A package memory contains the potential decision and derivations
that have already been made for a given package.
-}
type alias PackageAssignments =
    { decision : Maybe Version
    , derivations : List Term
    }


{-| Initialize a Memory from a decision.
-}
fromDecision : String -> Version -> Memory
fromDecision package version =
    Dict.singleton package { decision = Just version, derivations = [] }


{-| Initialize a Memory from a derivation.
-}
fromDerivation : String -> Term -> Memory
fromDerivation package term =
    Dict.singleton package { decision = Nothing, derivations = [ term ] }


{-| Retrieve all terms in memory.
-}
terms : Memory -> Dict String (List Term)
terms memory =
    Dict.map assignmentTerms memory


assignmentTerms : a -> PackageAssignments -> List Term
assignmentTerms _ { decision, derivations } =
    case decision of
        Nothing ->
            derivations

        Just version ->
            Term.Positive (Range.exact version) :: derivations


{-| Building step of a Memory from a given assignment.
-}
addAssignment : Assignment -> Memory -> Memory
addAssignment assignment memory =
    case assignment.kind of
        Assignment.Decision version ->
            addDecision assignment.package version memory

        Assignment.Derivation term _ ->
            addDerivation assignment.package term memory


{-| Add a decision to a Memory.
-}
addDecision : String -> Version -> Memory -> Memory
addDecision package version memory =
    Dict.update package (updateDecision version) memory


{-| Add a derivation to a Memory.
-}
addDerivation : String -> Term -> Memory -> Memory
addDerivation package term memory =
    Dict.update package (updateDerivations term) memory


{-| Add a decision for a given package.
This is a helper function for Dict updates.
-}
updateDecision : Version -> Maybe PackageAssignments -> Maybe PackageAssignments
updateDecision version maybe =
    case maybe of
        Nothing ->
            Just { decision = Just version, derivations = [] }

        Just { decision, derivations } ->
            case decision of
                Nothing ->
                    Just { decision = Just version, derivations = derivations }

                Just _ ->
                    Debug.todo "Cannot change a decision already made!"


{-| Add a term in the derivations of a given package.
This is a helper function for Dict updates.
-}
updateDerivations : Term -> Maybe PackageAssignments -> Maybe PackageAssignments
updateDerivations term maybe =
    case maybe of
        Nothing ->
            Just { decision = Nothing, derivations = [ term ] }

        Just { decision, derivations } ->
            Just { decision = decision, derivations = term :: derivations }


{-| Extract all packages that may potentially be picked next
to continue solving package dependencies.
A package is a potential pick if there isn't an already
version selected (no "decision")
and if it contains at least one positive derivation term
in the partial solution.
-}
potentialPackages : Memory -> Dict String (List Term)
potentialPackages memory =
    Utils.dictFilterMap (\_ p -> potentialPackage p) memory


potentialPackage : PackageAssignments -> Maybe (List Term)
potentialPackage { decision, derivations } =
    if decision == Nothing && List.any Term.isPositive derivations then
        Just derivations

    else
        Nothing



-- Final solution


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
solution : Memory -> Maybe (List ( String, Version ))
solution memory =
    if Utils.dictAll isValidPackage memory then
        Utils.dictFilterMap (\_ { decision } -> decision) memory
            |> Dict.toList
            |> Just

    else
        Nothing


isValidPackage : String -> PackageAssignments -> Bool
isValidPackage _ { decision, derivations } =
    case decision of
        Nothing ->
            not (List.any Term.isPositive derivations)

        Just _ ->
            True
