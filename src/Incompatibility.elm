module Incompatibility exposing (Incompatibility, Relation(..), asDict, fromDependencies, fromTerm, insert, merge, priorCause, relation, singlePositive, toDebugString)

import Dict exposing (Dict)
import Json.Encode
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)


{-| Hold a dual implementation of Dict and List for efficient runtime.
-}
type Incompatibility
    = Incompatibility (Dict String Term) (List ( String, Term ))


type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive



-- Interop


asDict : Incompatibility -> Dict String Term
asDict (Incompatibility incompat _) =
    incompat


fromTerm : String -> Term -> Incompatibility
fromTerm package term =
    Incompatibility (Dict.singleton package term) [ ( package, term ) ]



-- Debug


toDebugString : Int -> Incompatibility -> String
toDebugString indentation (Incompatibility incompat _) =
    Json.Encode.encode indentation <|
        Json.Encode.dict
            identity
            (\term -> Json.Encode.string (Term.toDebugString term))
            incompat



-- Functions


singlePositive : String -> Incompatibility -> Bool
singlePositive package (Incompatibility _ incompat) =
    case incompat of
        ( name, Term.Positive _ ) :: [] ->
            name == package

        _ ->
            False


{-| Generate a list of incompatibilities from direct dependencies of a package.
Dependencies MUST be unique (no duplicate package name)
due to usage of insert here.
-}
fromDependencies : String -> Version -> List ( String, Range ) -> List Incompatibility
fromDependencies package version dependencies =
    let
        baseIncompat =
            fromTerm package (Term.Positive (Range.exact version))

        addDependency ( name, range ) accumIncompats =
            insert name (Term.Negative range) baseIncompat :: accumIncompats
    in
    List.foldl addDependency [] dependencies


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
priorCause name (Incompatibility cause _) (Incompatibility incompat _) =
    union (Dict.remove name cause) (Dict.remove name incompat)


union : Dict String Term -> Dict String Term -> Incompatibility
union i1 i2 =
    Dict.merge insert fuse insert i1 i2 (Incompatibility Dict.empty [])


{-| Use only if guaranted that name is not already in the incompatibility
-}
insert : String -> Term -> Incompatibility -> Incompatibility
insert name term (Incompatibility dict list) =
    Incompatibility (Dict.insert name term dict) (( name, term ) :: list)


fuse : String -> Term -> Term -> Incompatibility -> Incompatibility
fuse name t1 t2 incompatibility =
    insert name (Term.union t1 t2) incompatibility


{-| We say that a set of terms S satisfies an incompatibility I
if S satisfies every term in I.
We say that S contradicts I
if S contradicts at least one term in I.
If S satisfies all but one of I's terms and is inconclusive for the remaining term,
we say S "almost satisfies" I and we call the remaining term the "unsatisfied term".
-}
relation : Incompatibility -> Dict String (List Term) -> Relation
relation (Incompatibility _ list) set =
    relationStep set list Satisfies


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

                        _ ->
                            relationStep set otherIncompats Inconclusive
