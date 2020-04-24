module Incompatibility exposing (Incompatibility, Relation(..), relation)

import Dict exposing (Dict)
import Term exposing (Term)


type alias Incompatibility =
    Dict String Term


type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive


relation : Incompatibility -> Dict String (List Term) -> Relation
relation incompat set =
    relationStep set (Dict.toList incompat) Satisfies


relationStep : Dict String (List Term) -> List ( String, Term ) -> Relation -> Relation
relationStep set incompat relationAccum =
    case incompat of
        [] ->
            relationAccum

        ( name, term ) :: otherIncompats ->
            let
                nameSet =
                    Maybe.withDefault [] (Dict.get name set)
            in
            case Term.relation term nameSet of
                Term.Satisfies ->
                    relationStep set otherIncompats relationAccum

                Term.Contradicts ->
                    Contradicts name term

                Term.Inconclusive ->
                    case relationAccum of
                        Satisfies ->
                            relationStep set otherIncompats (AlmostSatisfies name term)

                        AlmostSatisfies _ _ ->
                            relationStep set otherIncompats Inconclusive

                        _ ->
                            relationAccum
