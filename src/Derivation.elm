module Derivation exposing (Graph)

import Incompatibility exposing (Incompatibility)


type Graph
    = Leaf { external : Incompatibility }
    | Node { derived : Incompatibility, cause1 : Graph, cause2 : Graph }
