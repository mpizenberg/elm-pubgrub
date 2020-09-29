module PubGrub.Internal.Report exposing
    ( Tree(..), generate
    , DerivedIncompat, Incompat, Kind(..)
    )

{-| Module dealing with the textual reporting of the issue
when the solver failed, in the most human-readable possible way.

@docs Tree, generate

@docs DerivedIncompat, Incompat, Kind

Some remarks related to the algorithms below.

We give a ref number to a line either:

  - because the second branch is also long
  - or because it causes two or more derived incompatibilities

A derived can only "already" have a line number ref
if it is one that causes two or more derived incompatibilities.
Otherwise, it is necessarily the first (and only) time that we see the node,
and thus it cannot already have been marked with a line number.

So in practice, there is no need to save all lines that have been numberRef
because only those for shared nodes will be reused later.

-}

import AssocList as Dict exposing (Dict)
import PubGrub.Internal.Term as Term exposing (Term(..))
import PubGrub.Range as Range exposing (Range)


{-| Tree of incompatibilities leading to the root one.
-}
type Tree
    = Derived DerivedIncompat
    | External Incompat Kind


{-| External incompatibilities are of different kinds.
It may be that no version exist in a given range,
or the dependencies of a given package are not available,
or simply, it may track a package dependency.
-}
type Kind
    = NoVersion
    | UnavailableDependencies
    | Dependencies


{-| Incompatibility derived from two others.
It may be marked as "shared" if it is present multiple times
in the derivation tree.
-}
type alias DerivedIncompat =
    { incompat : Incompat
    , shared : Bool
    , cause1 : Tree
    , cause2 : Tree
    }


{-| Just an alias for type definitions.
-}
type alias Incompat =
    List ( String, Term )


type alias Accum =
    -- Number of explanations already with a line reference.
    { refCount : Int

    -- Shared nodes that have already been marked with a line reference.
    , sharedWithRef : Dict Incompat Int

    -- Accumulated lines of the report already generated (in reverse order).
    , lines : List String
    }



-- Helper functions


addLine : String -> Accum -> Accum
addLine line accum =
    { accum | lines = line :: accum.lines }


addLineRefIfNoneYet : Incompat -> Accum -> Accum
addLineRefIfNoneYet incompat accum =
    case Dict.get incompat accum.sharedWithRef of
        Nothing ->
            addLineRef accum
                |> (\( acc, lineRef ) -> updateSharedRef incompat lineRef acc)

        Just _ ->
            accum


addLineRef : Accum -> ( Accum, Int )
addLineRef { refCount, sharedWithRef, lines } =
    ( { refCount = refCount + 1
      , sharedWithRef = sharedWithRef
      , lines = appendLineRef (refCount + 1) lines
      }
    , refCount + 1
    )


appendLineRef : Int -> List String -> List String
appendLineRef lineRef lines =
    case lines of
        [] ->
            []

        latestLine :: olderLines ->
            (latestLine ++ " (" ++ String.fromInt lineRef ++ ")") :: olderLines


updateSharedRef : Incompat -> Int -> Accum -> Accum
updateSharedRef incompat lineRef ({ sharedWithRef } as accum) =
    { accum | sharedWithRef = Dict.insert incompat lineRef sharedWithRef }


getLineRef : DerivedIncompat -> Accum -> Maybe Int
getLineRef derived { sharedWithRef } =
    if derived.shared then
        Dict.get derived.incompat sharedWithRef

    else
        Nothing



-- Build the report


{-| Generate a human-readable textual report from a derivation tree.
-}
generate : Tree -> String
generate tree =
    buildFromTree tree { refCount = 0, sharedWithRef = Dict.empty, lines = [] }
        |> .lines
        |> List.reverse
        |> String.join "\n"


buildFromTree : Tree -> Accum -> Accum
buildFromTree tree accum =
    case tree of
        Derived derived ->
            buildFromDerived derived accum

        External external kind ->
            addLine (explainExternal external kind) accum


buildFromDerived : DerivedIncompat -> Accum -> Accum
buildFromDerived derived accum =
    if derived.shared then
        buildFromHelper derived accum
            |> addLineRefIfNoneYet derived.incompat

    else
        buildFromHelper derived accum


buildFromHelper : DerivedIncompat -> Accum -> Accum
buildFromHelper ({ incompat, cause1, cause2 } as current) accum =
    case ( cause1, cause2 ) of
        ( External external1 k1, External external2 k2 ) ->
            -- Simplest case, we just combine two external incompatibilities.
            addLine (explainBothExternal external1 k1 external2 k2 incompat) accum

        ( Derived derived, External external kind ) ->
            -- One cause is derived, so we explain this first
            -- then we add the external part
            -- and finally conclude with the current incompatibility.
            reportOneEach derived external kind incompat accum

        ( External external kind, Derived derived ) ->
            reportOneEach derived external kind incompat accum

        ( Derived derived1, Derived derived2 ) ->
            -- This is the most complex case since both causes are also derived.
            --
            -- If both causes already have been referenced (sharedWithRef),
            -- the explanation simply uses those references.
            --
            -- Otherwise, if one only has a line number reference,
            -- we recursively call the one without reference and then
            -- add the one with reference to conclude.
            --
            -- Finally, if no line reference exists yet,
            -- we call recursively the first one and then,
            --   - if this was a shared node, it will get a line ref
            --     and we can simply recall this with the current node.
            --   - otherwise, we add a line reference to it,
            --     recursively call on the second node,
            --     and finally conclude.
            case ( getLineRef derived1 accum, getLineRef derived2 accum ) of
                ( Just ref1, Just ref2 ) ->
                    addLine (explainBothRef ref1 derived1.incompat ref2 derived2.incompat incompat) accum

                ( Just ref, Nothing ) ->
                    buildFromDerived derived2 accum
                        |> addLine (andExplainRef ref derived1.incompat incompat)

                ( Nothing, Just ref ) ->
                    buildFromDerived derived1 accum
                        |> addLine (andExplainRef ref derived2.incompat incompat)

                ( Nothing, Nothing ) ->
                    if derived1.shared then
                        buildFromDerived derived1 accum
                            |> addLine ""
                            |> buildFromDerived current

                    else
                        let
                            ( newAccum, lineRef ) =
                                buildFromDerived derived1 accum
                                    |> addLineRef
                        in
                        addLine "" newAccum
                            |> buildFromDerived derived2
                            |> addLine (andExplainRef lineRef derived1.incompat incompat)


{-| Report a derived and an external incompatibility.

The result will depend on the fact that the derived incompatibility
has already been explained or not.

-}
reportOneEach : DerivedIncompat -> Incompat -> Kind -> Incompat -> Accum -> Accum
reportOneEach derived external kind incompat accum =
    case getLineRef derived accum of
        Just ref ->
            addLine (explainRefAndExternal ref derived.incompat external kind incompat) accum

        Nothing ->
            reportRecurseOneEach derived external kind incompat accum


{-| Report one derived (without a line ref yet) and one external.
-}
reportRecurseOneEach : DerivedIncompat -> Incompat -> Kind -> Incompat -> Accum -> Accum
reportRecurseOneEach derived external kind incompat accum =
    case ( derived.cause1, derived.cause2 ) of
        ( Derived priorDerived, External priorExternal pKind ) ->
            buildFromDerived priorDerived accum
                |> addLine (andExplainPriorAndExternal priorExternal pKind external kind incompat)

        ( External priorExternal pKind, Derived priorDerived ) ->
            buildFromDerived priorDerived accum
                |> addLine (andExplainPriorAndExternal priorExternal pKind external kind incompat)

        _ ->
            buildFromDerived derived accum
                |> addLine (andExplainExternal external kind incompat)



-- String explanations


explainExternal : Incompat -> Kind -> String
explainExternal external kind =
    externalReport " requires " external kind


explainBothExternal : Incompat -> Kind -> Incompat -> Kind -> Incompat -> String
explainBothExternal external1 k1 external2 k2 consequence =
    "Because "
        ++ externalReport " depends on " external1 k1
        ++ " and "
        ++ externalReport " depends on " external2 k2
        ++ ", "
        ++ incompatReport " requires " consequence
        ++ "."


explainBothRef : Int -> Incompat -> Int -> Incompat -> Incompat -> String
explainBothRef ref1 derived1 ref2 derived2 consequence =
    "Because "
        ++ incompatReport " depends on " derived1
        ++ (" (" ++ String.fromInt ref1 ++ ") and ")
        ++ incompatReport " depends on " derived2
        ++ (" (" ++ String.fromInt ref2 ++ "), ")
        ++ incompatReport " requires " consequence
        ++ "."


explainRefAndExternal : Int -> Incompat -> Incompat -> Kind -> Incompat -> String
explainRefAndExternal ref derived external kind consequence =
    "Because "
        ++ externalReport " depends on " external kind
        ++ " and "
        ++ incompatReport " depends on " derived
        ++ (" (" ++ String.fromInt ref ++ "), ")
        ++ incompatReport " requires " consequence
        ++ "."


andExplainExternal : Incompat -> Kind -> Incompat -> String
andExplainExternal external kind consequence =
    "And because "
        ++ externalReport " depends on " external kind
        ++ ", "
        ++ incompatReport " requires " consequence
        ++ "."


andExplainRef : Int -> Incompat -> Incompat -> String
andExplainRef ref derived consequence =
    "And because "
        ++ incompatReport " depends on " derived
        ++ (" (" ++ String.fromInt ref ++ "), ")
        ++ incompatReport " requires " consequence
        ++ "."


andExplainPriorAndExternal : Incompat -> Kind -> Incompat -> Kind -> Incompat -> String
andExplainPriorAndExternal priorExternal pKind external kind consequence =
    "And because "
        ++ externalReport " depends on " priorExternal pKind
        ++ " and "
        ++ externalReport " depends on " external kind
        ++ ", "
        ++ incompatReport " requires " consequence
        ++ "."



-- Textual representation of an incompatibility


externalReport : String -> Incompat -> Kind -> String
externalReport liaison incompat kind =
    case kind of
        NoVersion ->
            incompatReport liaison incompat ++ " (no version)"

        UnavailableDependencies ->
            incompatReport liaison incompat ++ " (dependencies unavailable)"

        _ ->
            incompatReport liaison incompat


incompatReport : String -> Incompat -> String
incompatReport liaison incompat =
    case incompat of
        ( package, Positive range ) :: ( dependency, Negative depRange ) :: [] ->
            dependenceReport package range liaison dependency depRange

        ( dependency, Negative depRange ) :: ( package, Positive range ) :: [] ->
            dependenceReport package range liaison dependency depRange

        ( package, Positive range ) :: [] ->
            package ++ " " ++ Range.toDebugString range ++ " is forbidden"

        ( package, Negative range ) :: [] ->
            package ++ " " ++ Range.toDebugString range ++ " is mandatory"

        [] ->
            "no package can be selected"

        _ ->
            List.map (\( p, t ) -> p ++ " " ++ Term.toDebugString t) incompat
                |> String.join ", "
                |> (\terms -> terms ++ " are incompatible")


dependenceReport : String -> Range -> String -> String -> Range -> String
dependenceReport package range liaison dependency depRange =
    (package ++ " " ++ Range.toDebugString range)
        ++ liaison
        ++ (dependency ++ " " ++ Range.toDebugString depRange)
