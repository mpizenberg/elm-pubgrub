module DerivationGraph exposing (DerivationGraph, Incompat, fromNodesAndEdges, toDot)

import Graph exposing (Edge, Graph, Node)
import Graph.DOT
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
