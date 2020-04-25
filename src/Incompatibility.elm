module Incompatibility exposing (Incompatibility, Relation(..), priorCause, relation)

import Dict exposing (Dict)
import Term exposing (Term)


type alias Incompatibility =
    Dict String Term


type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive


{-| union of incompat and satisfier's cause minus terms referring to satisfier's package"
-}
priorCause : String -> Incompatibility -> Incompatibility -> Incompatibility
priorCause name cause incompat =
    union (Dict.remove name cause) (Dict.remove name incompat)


union : Incompatibility -> Incompatibility -> Incompatibility
union i1 i2 =
    let
        ( small, big ) =
            if Dict.size i1 < Dict.size i2 then
                ( i1, i2 )

            else
                ( i2, i1 )
    in
    Dict.foldl termUnion big small


termUnion : String -> Term -> Incompatibility -> Incompatibility
termUnion name term incompat =
    case Dict.get name incompat of
        Nothing ->
            Dict.insert name term incompat

        Just baseTerm ->
            Dict.insert name (Term.union term baseTerm) incompat


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
