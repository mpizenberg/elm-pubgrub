module Assignment exposing (Assignment, Kind(..), encodeDebug, finalDecision, newDecision, newDerivation)

import Incompatibility exposing (Incompatibility)
import Json.Encode exposing (Value)
import Range
import Term exposing (Term)
import Version exposing (Version)


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



-- Debug


encodeDebug : Assignment -> Value
encodeDebug { name, term, decisionLevel, kind } =
    Json.Encode.object
        [ ( "kind", Json.Encode.string (kindToString kind) )
        , ( "name", Json.Encode.string name )
        , ( "decisionLevel", Json.Encode.int decisionLevel )
        , ( "term", Json.Encode.string (Term.toDebugString term) )
        ]


kindToString : Kind -> String
kindToString kind =
    case kind of
        Decision ->
            "Decision"

        Derivation _ ->
            "Derivation"



-- Functions


finalDecision : Assignment -> Maybe { name : String, version : Version }
finalDecision { name, term, kind } =
    case ( kind, term ) of
        ( Decision, Term.Positive (Range.Exact version) ) ->
            Just { name = name, version = version }

        _ ->
            Nothing


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
