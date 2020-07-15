module Report exposing (ReportNode, convertNodeContext, generate)

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



-- Helper functions


addLine : String -> Model -> Model
addLine line { referenceCount, graph, lines } =
    { referenceCount = referenceCount
    , graph = graph
    , lines = line :: lines
    }



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


generate : Int -> ReportGraph -> String
generate rootId graph =
    let
        root =
            case Graph.get rootId graph of
                Just { node } ->
                    node

                Nothing ->
                    Debug.todo "root node must exist"

        { lines } =
            buildFrom root { graph = graph, lines = [], referenceCount = 0 }
    in
    String.join "\n" (List.reverse lines)


buildFrom : Node ReportNode -> Model -> Model
buildFrom root ({ graph } as model) =
    -- TODO:
    -- Finally, if incompatibility causes two or more incompatibilities,
    -- give the line that was just written a line number.
    -- Set this as incompatibility's line number.
    case root.label.derivedFrom of
        Just ( causeId1, causeId2 ) ->
            case ( Graph.get causeId1 graph, Graph.get causeId2 graph ) of
                ( Just cause1, Just cause2 ) ->
                    buildFromHelper root cause1.node cause2.node model
                        |> maybeGiveLineNumber root

                _ ->
                    Debug.todo "Both causes nodes should exist"

        Nothing ->
            Debug.todo "Should not happen, should not have called recursively on a non derived incompat"


buildFromHelper : Node ReportNode -> Node ReportNode -> Node ReportNode -> Model -> Model
buildFromHelper root cause1 cause2 ({ graph } as model) =
    case ( cause1.label.derivedFrom, cause2.label.derivedFrom ) of
        -- 1. If incompatibility is caused by two other derived incompatibilities:
        ( Just ( id11, id12 ), Just ( id21, id22 ) ) ->
            case ( cause1.label.line, cause2.label.line ) of
                -- 1.i. If both causes already have line numbers:
                ( Just line1, Just line2 ) ->
                    addLine
                        ("Because "
                            ++ incompatReport " depends on " cause1.label.incompat
                            ++ (" (" ++ String.fromInt line1 ++ ") and ")
                            ++ incompatReport " depends on " cause2.label.incompat
                            ++ (" (" ++ String.fromInt line2 ++ "), ")
                            ++ incompatReport " requires " root.label.incompat
                            ++ "."
                        )
                        model

                -- 1.ii. Otherwise, if only one cause has a line number:
                ( Just line1, Nothing ) ->
                    buildFrom cause2 model
                        |> addLine
                            ("And because "
                                ++ incompatReport " depends on " cause1.label.incompat
                                ++ (" (" ++ String.fromInt line1 ++ "), ")
                                ++ incompatReport " requires " root.label.incompat
                                ++ "."
                            )

                ( Nothing, Just line2 ) ->
                    buildFrom cause1 model
                        |> addLine
                            ("And because "
                                ++ incompatReport " depends on " cause2.label.incompat
                                ++ (" (" ++ String.fromInt line2 ++ "), ")
                                ++ incompatReport " requires " root.label.incompat
                                ++ "."
                            )

                -- 1.iii. Otherwise (when neither has a line number):
                ( Nothing, Nothing ) ->
                    --- 1.iii.a.
                    if bothExternal id11 id12 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        buildFrom cause2 model
                            |> buildFrom cause1
                            |> addLine ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")

                    else if bothExternal id21 id22 graph then
                        -- Beware this will not be correct anymore
                        -- when we also update line numbers in the graph.
                        buildFrom cause1 model
                            |> buildFrom cause2
                            |> addLine ("Thus, " ++ incompatReport " requires " root.label.incompat ++ ".")

                    else
                        --- 1.iii.b.
                        -- "And because cause1 (cause1.line), incompatibility."
                        let
                            ( line, newModel ) =
                                buildFrom cause1 model
                                    |> giveLineNumberIfNoneYet cause1
                        in
                        addLine "" newModel
                            |> buildFrom cause2
                            |> addLine
                                ("And because "
                                    ++ incompatReport " depends on " cause1.label.incompat
                                    ++ (" (" ++ String.fromInt line ++ "), ")
                                    ++ incompatReport " requires " root.label.incompat
                                    ++ "."
                                )

        -- 2. Otherwise, if only one of incompatibility's causes is another derived incompatibility:
        ( Just derivedFrom, Nothing ) ->
            reportOneDerivedAndOneExternal root cause1 derivedFrom cause2 model

        ( Nothing, Just derivedFrom ) ->
            reportOneDerivedAndOneExternal root cause2 derivedFrom cause1 model

        -- 3. Otherwise (when both of incompatibility's causes are external incompatibilities):
        ( Nothing, Nothing ) ->
            -- "Because cause1 and cause2, incompatibility." :: lines
            addLine
                ("Because "
                    ++ incompatReport " depends on " cause1.label.incompat
                    ++ " and "
                    ++ incompatReport " depends on " cause2.label.incompat
                    ++ ", "
                    ++ incompatReport " requires " root.label.incompat
                    ++ "."
                )
                model


reportOneDerivedAndOneExternal : Node ReportNode -> Node ReportNode -> ( Int, Int ) -> Node ReportNode -> Model -> Model
reportOneDerivedAndOneExternal root derived ( id1, id2 ) external ({ graph, lines } as model) =
    -- 2.i. If derived already has a line number:
    if derived.label.line /= Nothing then
        -- "Because external and derived (derived.line), incompatibility." :: lines
        addLine
            ("Because "
                ++ incompatReport " depends on " external.label.incompat
                ++ " and "
                ++ incompatReport " depends on " derived.label.incompat
                ++ ", "
                ++ incompatReport " requires " root.label.incompat
                ++ "."
            )
            model

    else
        -- 2.ii. Otherwise, if derived is itself caused by exactly one derived incompatibility and that incompatibility doesn't have a line number:
        case onlyOneDerivedIncompatWithoutLineNumber id1 id2 graph of
            Just ( priorDerived, priorExternal ) ->
                -- "And because priorExternal and external, incompatibility."
                buildFrom priorDerived model
                    |> addLine
                        ("And because "
                            ++ incompatReport " depends on " priorExternal.label.incompat
                            ++ " and "
                            ++ incompatReport " depends on " external.label.incompat
                            ++ ", "
                            ++ incompatReport " requires " root.label.incompat
                            ++ "."
                        )

            -- 2.iii. Otherwise
            Nothing ->
                -- "And because external, incompatibility."
                buildFrom derived model
                    |> addLine
                        ("And because "
                            ++ incompatReport " depends on " external.label.incompat
                            ++ ", "
                            ++ incompatReport " requires " root.label.incompat
                            ++ "."
                        )


maybeGiveLineNumber : Node ReportNode -> Model -> Model
maybeGiveLineNumber root model =
    if root.label.causesTwoOrMore then
        Tuple.second (giveLineNumberIfNoneYet root model)

    else
        model


giveLineNumberIfNoneYet : Node ReportNode -> Model -> ( Int, Model )
giveLineNumberIfNoneYet node ({ graph, lines, referenceCount } as model) =
    case ( node.label.line, lines ) of
        ( Just line, _ ) ->
            ( line, model )

        ( Nothing, latestLine :: olderLines ) ->
            let
                incrementRefCount =
                    referenceCount + 1
            in
            ( incrementRefCount
            , { graph = Graph.update node.id (setLineNumber incrementRefCount) graph
              , lines = (latestLine ++ " (" ++ String.fromInt incrementRefCount ++ ")") :: olderLines
              , referenceCount = incrementRefCount
              }
            )

        ( Nothing, [] ) ->
            Debug.todo "There must be at least one line"


setLineNumber : Int -> Maybe (NodeContext ReportNode ()) -> Maybe (NodeContext ReportNode ())
setLineNumber line maybeContext =
    case maybeContext of
        Just { node, incoming, outgoing } ->
            let
                label =
                    node.label
            in
            Just
                { node =
                    { id = node.id
                    , label = { label | line = Just line }
                    }
                , incoming = incoming
                , outgoing = outgoing
                }

        Nothing ->
            Debug.todo "The node must exist, there is an error somewhere"



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
