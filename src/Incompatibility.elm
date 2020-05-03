module Incompatibility exposing (Incompatibility, Relation(..), fromDependencies, merge, priorCause, relation, termUnion, toDebugString)

import Dict exposing (Dict)
import Json.Encode
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)


type alias Incompatibility =
    Dict String Term


type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive



-- Debug


toDebugString : Incompatibility -> String
toDebugString incompat =
    Json.Encode.encode 2 <|
        Json.Encode.dict
            identity
            (\term -> Json.Encode.string (Term.toDebugString term))
            incompat



-- Functions


{-| Generate a list of incompatibilities from direct dependencies of a package.
-}
fromDependencies : String -> Version -> List ( String, Range ) -> List Incompatibility
fromDependencies package version dependencies =
    let
        baseIncompat =
            Dict.singleton package (Term.Positive (Range.Exact version))

        addIncompat ( name, range ) accumIncompats =
            Dict.insert name (Term.Negative range) baseIncompat :: accumIncompats
    in
    List.foldl addIncompat [] dependencies


{-| Add incompatibilities obtained from dependencies in to the set of incompatibilities.

Pubgrub collapses identical dependencies from adjacent package versions
into individual incompatibilities.
This substantially reduces the total number of incompatibilities
and makes it much easier for Pubgrub to reason about multiple versions of packages at once.
For example, rather than representing
foo 1.0.0 depends on bar ^1.0.0 and
foo 1.1.0 depends on bar ^1.0.0
as two separate incompatibilities,
they're collapsed together into the single incompatibility {foo ^1.0.0, not bar ^1.0.0}

Here we do the simple stupid thing of just growing the list.
TODO: improve this.

-}
merge : Incompatibility -> List Incompatibility -> List Incompatibility
merge incompat allIncompats =
    incompat :: allIncompats


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


{-| We say that a set of terms S satisfies an incompatibility I
if S satisfies every term in I.
We say that S contradicts I
if S contradicts at least one term in I.
If S satisfies all but one of I's terms and is inconclusive for the remaining term,
we say S "almost satisfies" I and we call the remaining term the "unsatisfied term".
-}
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
