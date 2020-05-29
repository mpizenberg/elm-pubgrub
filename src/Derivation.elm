module Derivation exposing (Graph)

{-| Representation of the derivation of terms as a graph.
NOT USED YET.

@docs Graph

-}

import Incompatibility exposing (Incompatibility)


{-| Derivation graph.
-}
type Graph
    = Leaf { external : Incompatibility }
    | Node { derived : Incompatibility, cause1 : Graph, cause2 : Graph }
