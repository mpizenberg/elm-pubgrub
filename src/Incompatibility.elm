module Incompatibility exposing
    ( Incompatibility, asDict, notRoot, noVersion, unavailableDeps, fromDependencies, toDebugString
    , merge, priorCause
    , Relation(..), relation
    , toReportTree
    , isTerminal
    )

{-| An incompatibility is a set of terms that should never
be satisfied all together.
This module provides functions to work with incompatibilities.

@docs Incompatibility, asDict, notRoot, noVersion, unavailableDeps, fromDependencies, toDebugString


# Composition of incompatibilities

@docs merge, priorCause


# Relation of satisfaction

@docs Relation, relation


# Error reporting

@docs toReportTree


# Other helper functions

@docs isTerminal

-}

import AssocList
import Dict exposing (Dict)
import Range exposing (Range)
import Report
import Term exposing (Term)
import Version exposing (Version)


{-| An incompatibility is a set of terms that should never
be satisfied all together.

An incompatibility usually originated from a package dependency.
For example, if package A at version 1 depends on package B
at version 2, you can never have both terms `A = 1`
and `not B = 2` satisfied at the same time in a partial solution.
This would mean that we found a solution with package A at version 1
but not with package B at version 2.
Yet A@1 depends on B@2 so this is not possible.
Therefore, the set `{ A = 1, not B = 2 }` is an incompatibility.

Incompatibilities can also be derived from two other incompatibilities
during conflict resolution. More about all this in
[PubGrub documentation](https://github.com/dart-lang/pub/blob/master/doc/solver.md#incompatibility).

This type holds a dual implementation for efficient runtime.
Both a temporally ordered list of terms,
and an organized dictionary of packages are useful
at different moments in the PubGrub algorithm.

TODO: Derived incompat with more than one term and has a positive term
referring to root and containing initial version:
Pub is normalizing those by removing the root package
which will always be satisfied.

TODO: Maybe the unknown kind should be extracted into
an Incompatibility variant NoVersion.
And the FromDependencyOf and DerivedFrom would be sub variants
of an IncompatibilityTree variant.

-}
type Incompatibility
    = Incompatibility { asDict : Dict String Term, asList : List ( String, Term ) } Kind


{-| An incompatibility can originate from a package dependency
or from the derivation of two other incompatibilities.

The Unknown case here is a temporary option
until I figure out how to get rid of this case.

-}
type Kind
    = NotRoot
    | NoVersion
    | UnavailableDependencies String Version
    | FromDependencyOf String Version
    | DerivedFrom Incompatibility Incompatibility


{-| A Relation describes how a set of terms can be compared to an incompatibility.

We say that a set of terms S satisfies an incompatibility I
if S satisfies every term in I.
We say that S contradicts I
if S contradicts at least one term in I.
If S satisfies all but one of I's terms and is inconclusive for the remaining term,
we say S "almost satisfies" I and we call the remaining term the "unsatisfied term".
Otherwise, we say that their relation is inconclusive.

-}
type Relation
    = Satisfies
    | AlmostSatisfies String Term
    | Contradicts String Term
    | Inconclusive



-- Interop


{-| Retrieve the dictionary representation of an incompatibility.
-}
asDict : Incompatibility -> Dict String Term
asDict (Incompatibility incompat _) =
    incompat.asDict


{-| Empty incompatibility.
-}
empty : Kind -> Incompatibility
empty kind =
    Incompatibility { asDict = Dict.empty, asList = [] } kind


{-| Singleton incompatibility.
-}
singleton : String -> Term -> Kind -> Incompatibility
singleton package term kind =
    Incompatibility { asDict = Dict.singleton package term, asList = [ ( package, term ) ] } kind


{-| Create the initial "not root" incompatibility.
-}
notRoot : String -> Version -> Incompatibility
notRoot package version =
    let
        term =
            Term.Negative (Range.exact version)
    in
    Incompatibility { asDict = Dict.singleton package term, asList = [ ( package, term ) ] } NotRoot


{-| Create an incompatibility to remember that a given range
does not contain any version.
-}
noVersion : String -> Term -> Incompatibility
noVersion package term =
    Incompatibility { asDict = Dict.singleton package term, asList = [ ( package, term ) ] } NoVersion


{-| Create an incompatibility to remember that a package version
is not selectable because its list of dependencies is unavailable.
-}
unavailableDeps : String -> Version -> Incompatibility
unavailableDeps package version =
    let
        term =
            Term.Positive (Range.exact version)
    in
    Incompatibility
        { asDict = Dict.singleton package term, asList = [ ( package, term ) ] }
        (UnavailableDependencies package version)



-- Debug


{-| String representation of an incompatibility,
for debug means.
-}
toDebugString : Int -> Int -> Incompatibility -> String
toDebugString recursiveDepth indent (Incompatibility { asList } kind) =
    case ( recursiveDepth, kind ) of
        ( 0, _ ) ->
            ""

        ( _, FromDependencyOf package version ) ->
            (String.repeat indent " " ++ termsString (List.reverse asList))
                ++ ("  <<<  from dependency of " ++ package ++ " at version " ++ Version.toDebugString version)

        ( _, NotRoot ) ->
            String.repeat indent " " ++ termsString asList ++ "  <<<  initial 'not root' incompatibility"

        ( _, NoVersion ) ->
            String.repeat indent " " ++ termsString asList ++ "  <<<  no version"

        ( _, UnavailableDependencies _ _ ) ->
            String.repeat indent " " ++ termsString asList ++ "  <<<  unavailable dependencies"

        ( 1, DerivedFrom _ _ ) ->
            String.repeat indent " " ++ termsString asList ++ "  <<<  derived"

        ( _, DerivedFrom cause1 cause2 ) ->
            (String.repeat indent " " ++ termsString asList ++ "  <<<  derived from:")
                ++ ("\n" ++ toDebugString (recursiveDepth - 1) (indent + 3) cause1)
                ++ ("\n" ++ toDebugString (recursiveDepth - 1) (indent + 3) cause2)


{-| Incompatibility terms as a printable string.
-}
termsString : List ( String, Term ) -> String
termsString terms =
    List.map (\( name, term ) -> name ++ ": " ++ Term.toDebugString term) terms
        |> String.join ", "



-- Functions


{-| Check if an incompatibility should mark the end of the algorithm
because of an issue.
-}
isTerminal : String -> Incompatibility -> Bool
isTerminal rootPackage (Incompatibility incompat _) =
    case incompat.asList of
        [] ->
            True

        ( package, Term.Positive _ ) :: [] ->
            package == rootPackage

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
    singleton package term (FromDependencyOf package version)
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
(provided that no other version of foo exists between 1.0.0 and 2.0.0).

Here we do the simple stupid thing of just growing the list.
TODO: improve this.

-}
merge : Incompatibility -> List Incompatibility -> List Incompatibility
merge incompat allIncompats =
    incompat :: allIncompats


{-| A prior cause is computed as the union of
the terms in the incompatibility and the terms in the satisfier's cause
minus the terms referring to satisfier's package.
-}
priorCause : Incompatibility -> Incompatibility -> Incompatibility
priorCause ((Incompatibility cause _) as i1) ((Incompatibility incompat _) as i2) =
    union cause.asDict incompat.asDict (DerivedFrom i1 i2)


{-| Union of all terms in two incompatibilities.
-}
union : Dict String Term -> Dict String Term -> Kind -> Incompatibility
union i1 i2 kind =
    Dict.merge insert fuse insert i1 i2 (empty kind)


fuse : String -> Term -> Term -> Incompatibility -> Incompatibility
fuse name t1 t2 incompatibility =
    let
        termUnion =
            Term.union t1 t2
    in
    if termUnion == Term.Negative Range.none then
        incompatibility

    else
        insert name termUnion incompatibility


{-| Insert a new package term inside an incompatibility.
Use ONLY if guaranted that the package name is not already in the incompatibility.
-}
insert : String -> Term -> Incompatibility -> Incompatibility
insert name term (Incompatibility incompat kind) =
    Incompatibility
        { asDict = Dict.insert name term incompat.asDict
        , asList = ( name, term ) :: incompat.asList
        }
        kind


{-| We say that a set of terms S satisfies an incompatibility I
if S satisfies every term in I.
We say that S contradicts I
if S contradicts at least one term in I.
If S satisfies all but one of I's terms and is inconclusive for the remaining term,
we say S "almost satisfies" I and we call the remaining term the "unsatisfied term".
-}
relation : Dict String (List Term) -> Incompatibility -> Relation
relation set (Incompatibility { asList } _) =
    relationStep set asList Satisfies


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



-- Error reporting


type alias SharedSet =
    AssocList.Dict Report.Incompat ()


{-| Convert an incompatibility into a tree useful for error reporting.
-}
toReportTree : Incompatibility -> Report.Tree
toReportTree incompat =
    let
        ( _, shared ) =
            sharedNodes incompat ( AssocList.empty, AssocList.empty )
    in
    toReportTreeHelper shared incompat


sharedNodes : Incompatibility -> ( SharedSet, SharedSet ) -> ( SharedSet, SharedSet )
sharedNodes (Incompatibility { asList } kind) seenAndShared =
    case kind of
        DerivedFrom i1 i2 ->
            let
                ( seen, shared ) =
                    sharedNodes i1 (sharedNodes i2 seenAndShared)
            in
            if AssocList.member asList seen then
                ( seen, AssocList.insert asList () shared )

            else
                ( AssocList.insert asList () seen, shared )

        _ ->
            seenAndShared


toReportTreeHelper : SharedSet -> Incompatibility -> Report.Tree
toReportTreeHelper shared (Incompatibility { asList } kind) =
    case kind of
        DerivedFrom i1 i2 ->
            let
                t1 =
                    toReportTreeHelper shared i1

                t2 =
                    toReportTreeHelper shared i2
            in
            Report.Derived
                { incompat = asList
                , shared = AssocList.member asList shared
                , cause1 = t1
                , cause2 = t2
                }

        NoVersion ->
            Report.External asList Report.NoVersion

        UnavailableDependencies _ _ ->
            Report.External asList Report.UnavailableDependencies

        FromDependencyOf _ _ ->
            Report.External asList Report.Dependencies

        NotRoot ->
            Debug.todo "This should not appear in the report tree"
