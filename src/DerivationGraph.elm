module DerivationGraph exposing (DerivationGraph, Incompat, fromNodesAndEdges, report, toDot)

import Graph exposing (Edge, Graph, Node, NodeContext)
import Graph.DOT
import IntDict exposing (IntDict)
import Range exposing (Range)
import Report
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


report : DerivationGraph -> String
report derivationGraph =
    let
        reportGraph =
            Graph.mapContexts Report.convertNodeContext derivationGraph

        root =
            case Graph.get 0 reportGraph of
                Just { node } ->
                    node

                Nothing ->
                    Debug.todo "root node must exist"
    in
    Report.buildFrom root reportGraph []
        |> List.reverse
        |> String.join "\n"
