module PartialSolution exposing (Assignment(..), PartialSolution, isSolution, toDict)

import Dict exposing (Dict)
import Incompatibility exposing (Incompatibility)
import Term exposing (Term)


type alias PartialSolution =
    List Assignment


type Assignment {- Decision: individual package ids -}
    = Decision { decisionLevel : Int, name : String, term : Term }
      -- Derivation: "ranges" terms that must be true
      -- given previous assignments and all incompatibilities
    | Derivation { decisionLevel : Int, cause : Incompatibility, name : String, term : Term }


toDict : PartialSolution -> Dict String (List Term)
toDict partial =
    List.foldr addAssignment Dict.empty partial


addAssignment : Assignment -> Dict String (List Term) -> Dict String (List Term)
addAssignment assignment allTerms =
    let
        ( name, term ) =
            nameAndTerm assignment
    in
    Dict.update name (addTerm term) allTerms


addTerm : Term -> Maybe (List Term) -> Maybe (List Term)
addTerm term maybeTerms =
    case maybeTerms of
        Nothing ->
            Just [ term ]

        Just otherTerms ->
            Just (term :: otherTerms)


nameAndTerm : Assignment -> ( String, Term )
nameAndTerm assignment =
    case assignment of
        Decision { name, term } ->
            ( name, term )

        Derivation { name, term } ->
            ( name, term )


{-| If a partial solution has, for every positive derivation,
a corresponding decision that satisfies that assignment,
it's a total solution and version solving has succeeded.
-}
isSolution : PartialSolution -> Bool
isSolution partial =
    case partial of
        [] ->
            True

        (Decision _) :: others ->
            isSolution others

        (Derivation { name, term }) :: others ->
            case term of
                Term.Negative _ ->
                    isSolution others

                Term.Positive _ ->
                    -- BEWARE, not tail recursive
                    Term.satisfies term (decision name others) && isSolution others


decision : String -> PartialSolution -> List Term
decision searchedName partial =
    case partial of
        [] ->
            []

        (Decision { name, term }) :: others ->
            if name == searchedName then
                [ term ]

            else
                decision searchedName others

        _ :: others ->
            decision searchedName others
