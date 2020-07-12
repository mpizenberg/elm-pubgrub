module DerivationGraph exposing (DerivationGraph, Incompat, fromNodesAndEdges, toDot)

import Graph exposing (Edge, Graph, Node, NodeContext)
import Graph.DOT
import IntDict exposing (IntDict)
import Term exposing (Term)


type alias DerivationGraph =
    Graph Incompat ()


type alias Incompat =
    List ( String, Term )


fromNodesAndEdges : ( List (Node Incompat), List (Edge ()) ) -> DerivationGraph
fromNodesAndEdges ( nodes, edges ) =
    Graph.fromNodesAndEdges nodes edges


toDot : DerivationGraph -> String
toDot graph =
    Graph.DOT.output (Just << termsString) (always Nothing) graph


{-| Incompatibility terms as a printable string.
-}
termsString : List ( String, Term ) -> String
termsString terms =
    List.map (\( name, term ) -> name ++ ": " ++ Term.toDebugString term) terms
        |> String.join ", "


type alias ReportGraph =
    Graph ReportNode ()


type alias ReportNode =
    { derivedFrom : Maybe ( Int, Int )
    , causesTwoOrMore : Bool
    , line : Maybe Int
    , incompat : Incompat
    }


toReportGraph : DerivationGraph -> ReportGraph
toReportGraph graph =
    Graph.mapContexts reportContext graph


reportContext : NodeContext Incompat () -> NodeContext ReportNode ()
reportContext { node, incoming, outgoing } =
    { node = initReportContextNode node incoming outgoing
    , incoming = incoming
    , outgoing = outgoing
    }


initReportContextNode : Incompat -> IntDict () -> IntDict () -> ReportNode
initReportContextNode incompat incoming outgoing =
    let
        derivedFrom =
            case IntDict.keys outgoing of
                [] ->
                    Nothing

                first :: second :: [] ->
                    Just ( first, second )

                _ ->
                    Debug.todo "Should never happen, must be 0 or 2"
    in
    { derivedFrom = derivedFrom
    , causesTwoOrMore = IntDict.size incoming >= 2
    , line = Nothing
    , incompat = incompat
    }


reportError : Int -> DerivationGraph -> List String -> List String
reportError rootId graph lines =
    -- TODO:
    -- Finally, if incompatibility causes two or more incompatibilities,
    -- give the line that was just written a line number.
    -- Set this as incompatibility's line number.
    case Graph.get rootId graph of
        Nothing ->
            Debug.todo "This should not happen, node must exist"

        Just { node, outgoing } ->
            if causedByTwoDerived node outgoing then
                if haveLinesNumbers outgoing then
                    "Because cause1 (cause1.line) and cause2 (cause2.line), incompatibility." :: lines

                else if onlyOneCauseLineNumber outgoing then
                    let
                        newLines =
                            reportError idOfCauseWithoutLineNumber graph lines
                    in
                    "And because causeWithLine (causeWithLine.line), incompatibility." :: newLines
                    -- when neither has a line number

                else if atLeastOneCauseIncompatibilityIsCausedByTwoExternal outgoing then
                    let
                        ( simple, complex ) =
                            simpleAndComplex outgoing

                        newLines =
                            reportError complex graph lines
                    in
                    "Thus, incompatibility." :: reportError simple graph newLines

                else
                    let
                        ( first, second ) =
                            firstAndSecond outgoing

                        firstLines =
                            reportError first graph lines

                        _ =
                            Debug.todo "give the final line a line number if it doesn't have one already. Set this as the first cause's line number."

                        secondLines =
                            reportError second graph ("" :: firstLines)

                        _ =
                            Debug.todo "add a line number to the final line. Associate this line number with the first cause."
                    in
                    "And because cause1 (cause1.line), incompatibility." :: secondLines

            else if causedByOneDerived node outgoing then
                if hasLineNumber derived then
                    "Because external and derived (derived.line), incompatibility." :: lines

                else if causedByOneDerivedIncompatWithoutLineNumber derived then
                    let
                        ( priorDerived, priorExternal ) =
                            priorDerivedAndExternal derived

                        newLines =
                            reportError priorDerived graph lines
                    in
                    "And because priorExternal and external, incompatibility." :: newLines

                else
                    "And because external, incompatibility." :: reportError derived graph lines
                -- when both of incompatibility's causes are external incompatibilities

            else
                "Because cause1 and cause2, incompatibility." :: lines
