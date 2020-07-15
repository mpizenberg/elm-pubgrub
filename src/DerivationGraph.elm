module DerivationGraph exposing (DerivationGraph, Incompat, fromNodesAndEdges, report, toDot)

import Graph exposing (Edge, Graph, Node, NodeContext)
import Graph.DOT
import IntDict exposing (IntDict)
import Range exposing (Range)
import Term exposing (Term(..))


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


initReportContextNode : Node Incompat -> IntDict () -> IntDict () -> Node ReportNode
initReportContextNode node incoming outgoing =
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
    { id = node.id
    , label =
        { derivedFrom = derivedFrom
        , causesTwoOrMore = IntDict.size incoming >= 2
        , line = Nothing
        , incompat = node.label
        }
    }


report : DerivationGraph -> String
report derivationGraph =
    let
        reportGraph =
            toReportGraph derivationGraph

        root =
            case Graph.get 0 reportGraph of
                Just { node } ->
                    node

                Nothing ->
                    Debug.todo "root node must exist"
    in
    reportError root reportGraph []
        |> List.reverse
        |> String.join "\n"


reportError : Node ReportNode -> ReportGraph -> List String -> List String
reportError root graph lines =
    -- TODO:
    -- Finally, if incompatibility causes two or more incompatibilities,
    -- give the line that was just written a line number.
    -- Set this as incompatibility's line number.
    case root.label.derivedFrom of
        Just ( causeId1, causeId2 ) ->
            case ( Graph.get causeId1 graph, Graph.get causeId2 graph ) of
                ( Just cause1, Just cause2 ) ->
                    reportErrorCore root cause1.node cause2.node graph lines

                _ ->
                    Debug.todo "Both causes nodes should exist"

        Nothing ->
            Debug.todo "Should not happen, should not have called recursively on a non derived incompat"


reportErrorCore : Node ReportNode -> Node ReportNode -> Node ReportNode -> ReportGraph -> List String -> List String
reportErrorCore root cause1 cause2 graph lines =
    case ( cause1.label.derivedFrom, cause2.label.derivedFrom ) of
        -- 1. If incompatibility is caused by two other derived incompatibilities:
        ( Just ( id11, id12 ), Just ( id21, id22 ) ) ->
            case ( cause1.label.line, cause2.label.line ) of
                -- 1.i. If both causes already have line numbers:
                ( Just line1, Just line2 ) ->
                    "Because cause1 (cause1.line) and cause2 (cause2.line), incompatibility." :: lines

                -- 1.ii. Otherwise, if only one cause has a line number:
                ( Just line1, Nothing ) ->
                    "And because cause1 (cause1.line), incompatibility."
                        :: reportError cause2 graph lines

                ( Nothing, Just line2 ) ->
                    "And because cause2 (cause2.line), incompatibility."
                        :: reportError cause1 graph lines

                -- 1.iii. Otherwise (when neither has a line number):
                ( Nothing, Nothing ) ->
                    --- 1.iii.a.
                    if bothExternal id11 id12 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")
                            :: reportError cause1 graph []
                            ++ reportError cause2 graph lines

                    else if bothExternal id21 id22 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")
                            :: reportError cause2 graph []
                            ++ reportError cause1 graph lines

                    else
                        --- 1.iii.b.
                        -- "And because cause1 (cause1.line), incompatibility."
                        -- TODO: add line
                        ("And because "
                            ++ incompatReport " depends on " cause1.label.incompat
                            ++ ", "
                            ++ incompatReport " requires " root.label.incompat
                            ++ "."
                        )
                            :: reportError cause2 graph []
                            ++ ("" :: reportError cause1 graph lines)

        -- 2. Otherwise, if only one of incompatibility's causes is another derived incompatibility:
        ( Just derivedFrom, Nothing ) ->
            reportOneDerivedAndOneExternal root cause1 derivedFrom cause2 graph lines

        ( Nothing, Just derivedFrom ) ->
            reportOneDerivedAndOneExternal root cause2 derivedFrom cause1 graph lines

        -- 3. Otherwise (when both of incompatibility's causes are external incompatibilities):
        ( Nothing, Nothing ) ->
            -- "Because cause1 and cause2, incompatibility." :: lines
            ("Because "
                ++ incompatReport " depends on " cause1.label.incompat
                ++ " and "
                ++ incompatReport " depends on " cause2.label.incompat
                ++ ", "
                ++ incompatReport " requires " root.label.incompat
                ++ "."
            )
                :: lines


bothExternal : Int -> Int -> ReportGraph -> Bool
bothExternal id1 id2 graph =
    case ( Graph.get id1 graph, Graph.get id2 graph ) of
        ( Just context1, Just context2 ) ->
            (context1.node.label.derivedFrom == Nothing)
                && (context2.node.label.derivedFrom == Nothing)

        _ ->
            Debug.todo "Both nodes should exist"


reportOneDerivedAndOneExternal : Node ReportNode -> Node ReportNode -> ( Int, Int ) -> Node ReportNode -> ReportGraph -> List String -> List String
reportOneDerivedAndOneExternal root derived ( id1, id2 ) external graph lines =
    -- 2.i. If derived already has a line number:
    if derived.label.line /= Nothing then
        -- "Because external and derived (derived.line), incompatibility." :: lines
        ("Because "
            ++ incompatReport " depends on " external.label.incompat
            ++ " and "
            ++ incompatReport " depends on " derived.label.incompat
            ++ ", "
            ++ incompatReport " requires " root.label.incompat
            ++ "."
        )
            :: lines

    else
        -- 2.ii. Otherwise, if derived is itself caused by exactly one derived incompatibility and that incompatibility doesn't have a line number:
        case onlyOneDerivedIncompatWithoutLineNumber id1 id2 graph of
            Just ( priorDerived, priorExternal ) ->
                -- "And because priorExternal and external, incompatibility."
                ("And because "
                    ++ incompatReport " depends on " priorExternal.label.incompat
                    ++ " and "
                    ++ incompatReport " depends on " external.label.incompat
                    ++ ", "
                    ++ incompatReport " requires " root.label.incompat
                    ++ "."
                )
                    :: reportError priorDerived graph lines

            -- 2.iii. Otherwise
            Nothing ->
                -- "And because external, incompatibility."
                ("And because "
                    ++ incompatReport " depends on " external.label.incompat
                    ++ ", "
                    ++ incompatReport " requires " root.label.incompat
                    ++ "."
                )
                    :: reportError derived graph lines


onlyOneDerivedIncompatWithoutLineNumber : Int -> Int -> ReportGraph -> Maybe ( Node ReportNode, Node ReportNode )
onlyOneDerivedIncompatWithoutLineNumber id1 id2 graph =
    case ( Graph.get id1 graph, Graph.get id2 graph ) of
        ( Just ctx1, Just ctx2 ) ->
            case ( ctx1.node.label.derivedFrom, ctx2.node.label.derivedFrom ) of
                ( Just _, Nothing ) ->
                    if ctx1.node.label.line == Nothing then
                        Just ( ctx1.node, ctx2.node )

                    else
                        Nothing

                ( Nothing, Just _ ) ->
                    if ctx2.node.label.line == Nothing then
                        Just ( ctx2.node, ctx1.node )

                    else
                        Nothing

                _ ->
                    Nothing

        _ ->
            Debug.todo "Both nodes should exist"



-- Textual report


incompatReport : String -> Incompat -> String
incompatReport liaison incompat =
    case incompat of
        ( package, Positive range ) :: ( dependency, Negative depRange ) :: [] ->
            dependenceReport package range liaison dependency depRange

        ( dependency, Negative depRange ) :: ( package, Positive range ) :: [] ->
            dependenceReport package range liaison dependency depRange

        ( package, Positive range ) :: [] ->
            package ++ " " ++ Range.toDebugString range ++ " is impossible"

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
