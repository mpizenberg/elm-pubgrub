module Assignment exposing (Assignment, Kind(..), newDecision, newDerivation)

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


newDecision : String -> Term -> Int -> Assignment
newDecision name term decisionLevel =
    { name = name
    , term = term
    , decisionLevel = decisionLevel
    , kind = Decision
    }


newDerivation : String -> Term -> Int -> Incompatibility -> Assignment
newDerivation name term decisionLevel cause =
    { name = name
    , term = term
    , decisionLevel = decisionLevel
    , kind = Derivation { cause = cause }
    }
