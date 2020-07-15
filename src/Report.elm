module Report exposing (ReportNode, buildFrom, convertNodeContext)

import Graph exposing (Graph, Node, NodeContext)
import IntDict exposing (IntDict)
import Range exposing (Range)
import Term exposing (Term(..))


type alias Model =
    -- Number of explanations already with a line reference.
    { referenceCount : Int

    -- The graph used for reporting.
    , graph : ReportGraph

    -- Accumulated lines of the report already generated (in reverse order).
    , lines : List String
    }


type alias ReportGraph =
    Graph ReportNode ()


type alias ReportNode =
    { derivedFrom : Maybe ( Int, Int )
    , causesTwoOrMore : Bool
    , line : Maybe Int
    , incompat : Incompat
    }


type alias Incompat =
    List ( String, Term )



-- Initialize the ReportGraph


convertNodeContext : NodeContext Incompat () -> NodeContext ReportNode ()
convertNodeContext { node, incoming, outgoing } =
    { node = initReportNodeContext node incoming outgoing
    , incoming = incoming
    , outgoing = outgoing
    }


initReportNodeContext : Node Incompat -> IntDict () -> IntDict () -> Node ReportNode
initReportNodeContext node incoming outgoing =
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



-- Build the report


buildFrom : Node ReportNode -> ReportGraph -> List String -> List String
buildFrom root graph lines =
    -- TODO:
    -- Finally, if incompatibility causes two or more incompatibilities,
    -- give the line that was just written a line number.
    -- Set this as incompatibility's line number.
    case root.label.derivedFrom of
        Just ( causeId1, causeId2 ) ->
            case ( Graph.get causeId1 graph, Graph.get causeId2 graph ) of
                ( Just cause1, Just cause2 ) ->
                    buildFromHelper root cause1.node cause2.node graph lines

                _ ->
                    Debug.todo "Both causes nodes should exist"

        Nothing ->
            Debug.todo "Should not happen, should not have called recursively on a non derived incompat"


buildFromHelper : Node ReportNode -> Node ReportNode -> Node ReportNode -> ReportGraph -> List String -> List String
buildFromHelper root cause1 cause2 graph lines =
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
                        :: buildFrom cause2 graph lines

                ( Nothing, Just line2 ) ->
                    "And because cause2 (cause2.line), incompatibility."
                        :: buildFrom cause1 graph lines

                -- 1.iii. Otherwise (when neither has a line number):
                ( Nothing, Nothing ) ->
                    --- 1.iii.a.
                    if bothExternal id11 id12 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")
                            :: buildFrom cause1 graph []
                            ++ buildFrom cause2 graph lines

                    else if bothExternal id21 id22 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")
                            :: buildFrom cause2 graph []
                            ++ buildFrom cause1 graph lines

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
                            :: buildFrom cause2 graph []
                            ++ ("" :: buildFrom cause1 graph lines)

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
                    :: buildFrom priorDerived graph lines

            -- 2.iii. Otherwise
            Nothing ->
                -- "And because external, incompatibility."
                ("And because "
                    ++ incompatReport " depends on " external.label.incompat
                    ++ ", "
                    ++ incompatReport " requires " root.label.incompat
                    ++ "."
                )
                    :: buildFrom derived graph lines



-- Branching helpers


bothExternal : Int -> Int -> ReportGraph -> Bool
bothExternal id1 id2 graph =
    case ( Graph.get id1 graph, Graph.get id2 graph ) of
        ( Just context1, Just context2 ) ->
            (context1.node.label.derivedFrom == Nothing)
                && (context2.node.label.derivedFrom == Nothing)

        _ ->
            Debug.todo "Both nodes should exist"


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
