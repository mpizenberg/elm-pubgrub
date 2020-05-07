module Incompatibility exposing (Incompatibility, Relation(..), asDict, fromDependencies, fromTerm, insert, merge, priorCause, relation, singlePositive, toDebugString)

import Dict exposing (Dict)
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)


{-| Hold a dual implementation of Dict and List for efficient runtime.
-}
type Incompatibility
    = Incompatibility (Dict String Term) (List ( String, Term )) Kind


type Kind
    = FromDependencyOf String Version
    | DerivedFrom Incompatibility Incompatibility
    | Unknown


type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive



-- Interop


asDict : Incompatibility -> Dict String Term
asDict (Incompatibility incompat _ _) =
    incompat


fromTerm : String -> Term -> Incompatibility
fromTerm package term =
    Incompatibility (Dict.singleton package term) [ ( package, term ) ] Unknown



-- Debug


toDebugString : Int -> Int -> Incompatibility -> String
toDebugString recursiveDepth indent (Incompatibility _ list kind) =
    case ( recursiveDepth, kind ) of
        ( 0, _ ) ->
            ""

        ( _, FromDependencyOf package version ) ->
            (String.repeat indent " " ++ termsString (List.reverse list))
                ++ ("  <<<  from dependency of " ++ package ++ " at version " ++ Version.toDebugString version)

        ( _, Unknown ) ->
            String.repeat indent " " ++ termsString list ++ "  <<<  from unknown reason ..."

        ( 1, DerivedFrom _ _ ) ->
            String.repeat indent " " ++ termsString list ++ "  <<<  derived"

        ( _, DerivedFrom cause1 cause2 ) ->
            (String.repeat indent " " ++ termsString list ++ "  <<<  derived from:")
                ++ ("\n" ++ toDebugString (recursiveDepth - 1) (indent + 3) cause1)
                ++ ("\n" ++ toDebugString (recursiveDepth - 1) (indent + 3) cause2)


termsString : List ( String, Term ) -> String
termsString terms =
    List.map (\( name, term ) -> name ++ ": " ++ Term.toDebugString term) terms
        |> String.join ", "



-- Functions


singlePositive : String -> Incompatibility -> Bool
singlePositive package (Incompatibility _ incompat _) =
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
        addDependency dep accumIncompats =
            fromDependency package version dep :: accumIncompats
    in
    List.foldl addDependency [] dependencies


fromDependency : String -> Version -> ( String, Range ) -> Incompatibility
fromDependency package version ( depPackage, depRange ) =
    let
        term =
            Term.Positive (Range.exact version)
    in
    FromDependencyOf package version
        |> Incompatibility (Dict.singleton package term) [ ( package, term ) ]
        |> insert depPackage (Term.Negative depRange)


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
priorCause name ((Incompatibility cause _ _) as i1) ((Incompatibility incompat _ _) as i2) =
    union (Dict.remove name cause) (Dict.remove name incompat) (DerivedFrom i1 i2)


union : Dict String Term -> Dict String Term -> Kind -> Incompatibility
union i1 i2 kind =
    Dict.merge insert fuse insert i1 i2 (Incompatibility Dict.empty [] kind)


{-| Use only if guaranted that name is not already in the incompatibility
-}
insert : String -> Term -> Incompatibility -> Incompatibility
insert name term (Incompatibility dict list kind) =
    Incompatibility (Dict.insert name term dict) (( name, term ) :: list) kind


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
relation (Incompatibility _ list _) set =
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
