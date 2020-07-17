module Report exposing (DerivedIncompat, Incompat, Tree(..), generate)

{-| We give a ref number to a line either:

    - because the second branch is also long
    - or because it causes two or more derived incompats

A derived can only "already" have a line number ref
if it is one that causes two or more derived incompatibilities.
Otherwise, it is necessarily the first (and only) time that we see the node,
and thus it cannot already have been marked with a line number.

So in practice, there is no need to save all lines that have been numberRef
because only those for shared nodes will be reused later.

-}

import AssocList as Dict exposing (Dict)
import Range exposing (Range)
import Term exposing (Term(..))


type Tree
    = Derived DerivedIncompat
    | External Incompat


type alias DerivedIncompat =
    { incompat : Incompat
    , shared : Bool
    , cause1 : Tree
    , cause2 : Tree
    }


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

        External _ ->
            Debug.todo "This should never happen (except if there is a single rule directly saying that root cannot be choosen)"


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
        ( External external1, External external2 ) ->
            -- Simplest case, we just combine two external incompatibilities.
            addLine (explainBothExternal external1 external2 incompat) accum

        ( Derived derived, External external ) ->
            -- One cause is derived, so we explain this first
            -- then we add the external part
            -- and finally conclude with the current incompatibility.
            reportOneEach derived external incompat accum

        ( External external, Derived derived ) ->
            reportOneEach derived external incompat accum

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
reportOneEach : DerivedIncompat -> Incompat -> Incompat -> Accum -> Accum
reportOneEach derived external incompat accum =
    case getLineRef derived accum of
        Just ref ->
            addLine (explainRefAndExternal ref derived.incompat external incompat) accum

        Nothing ->
            reportRecurseOneEach derived external incompat accum


{-| Report one derived (without a line ref yet) and one external.
-}
reportRecurseOneEach : DerivedIncompat -> Incompat -> Incompat -> Accum -> Accum
reportRecurseOneEach derived external incompat accum =
    case ( derived.cause1, derived.cause2 ) of
        ( Derived priorDerived, External priorExternal ) ->
            buildFromDerived priorDerived accum
                |> addLine (andExplainPriorAndExternal priorExternal external incompat)

        ( External priorExternal, Derived priorDerived ) ->
            buildFromDerived priorDerived accum
                |> addLine (andExplainPriorAndExternal priorExternal external incompat)

        _ ->
            buildFromDerived derived accum
                |> addLine (andExplainExternal external incompat)



-- String explanations


explainBothExternal : Incompat -> Incompat -> Incompat -> String
explainBothExternal external1 external2 consequence =
    "Because "
        ++ incompatReport " depends on " external1
        ++ " and "
        ++ incompatReport " depends on " external2
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


explainRefAndExternal : Int -> Incompat -> Incompat -> Incompat -> String
explainRefAndExternal ref derived external consequence =
    "Because "
        ++ incompatReport " depends on " external
        ++ " and "
        ++ incompatReport " depends on " derived
        ++ (" (" ++ String.fromInt ref ++ "), ")
        ++ incompatReport " requires " consequence
        ++ "."


andExplainExternal : Incompat -> Incompat -> String
andExplainExternal external consequence =
    "And because "
        ++ incompatReport " depends on " external
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


andExplainPriorAndExternal : Incompat -> Incompat -> Incompat -> String
andExplainPriorAndExternal priorExternal external consequence =
    "And because "
        ++ incompatReport " depends on " priorExternal
        ++ " and "
        ++ incompatReport " depends on " external
        ++ ", "
        ++ incompatReport " requires " consequence
        ++ "."



-- Textual representation of an incompatibility


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

        _ ->
            List.map (\( p, t ) -> p ++ " " ++ Term.toDebugString t) incompat
                |> String.join ", "
                |> (\terms -> terms ++ " are incompatible")


dependenceReport : String -> Range -> String -> String -> Range -> String
dependenceReport package range liaison dependency depRange =
    (package ++ " " ++ Range.toDebugString range)
        ++ liaison
        ++ (dependency ++ " " ++ Range.toDebugString depRange)
