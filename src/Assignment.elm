module Assignment exposing (Assignment, Kind(..))

import Incompatibility exposing (Incompatibility)
import Term exposing (Term)


type alias Assignment =
    { name : String
    , term : Term
    , decisionLevel : Int
    , kind : Kind
    }


type Kind {- Decision: individual package ids -}
    = Decision
      -- Derivation: "ranges" terms that must be true
      -- given previous assignments and all incompatibilities
    | Derivation { cause : Incompatibility }

