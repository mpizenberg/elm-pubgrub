module Assignment exposing (Assignment, Kind(..), encodeDebug, finalDecision, getTerm, newDecision, newDerivation)

import Incompatibility exposing (Incompatibility)
import Json.Encode exposing (Value)
import Range
import Term exposing (Term)
import Version exposing (Version)


type alias Assignment =
    { name : String
    , decisionLevel : Int
    , kind : Kind
    }


type Kind {- Decision: individual package ids -}
    = Decision Version
      -- Derivation: "ranges" terms that must be true
      -- given previous assignments and all incompatibilities
    | Derivation Term { cause : Incompatibility }



-- Debug


encodeDebug : Assignment -> Value
encodeDebug { name, decisionLevel, kind } =
    case kind of
        Decision version ->
            Json.Encode.object
                [ ( "kind", Json.Encode.string "Decision" )
                , ( "name", Json.Encode.string name )
                , ( "decisionLevel", Json.Encode.int decisionLevel )
                , ( "version", Json.Encode.string (Version.toDebugString version) )
                ]

        Derivation term _ ->
            Json.Encode.object
                [ ( "kind", Json.Encode.string "Derivation" )
                , ( "name", Json.Encode.string name )
                , ( "decisionLevel", Json.Encode.int decisionLevel )
                , ( "term", Json.Encode.string (Term.toDebugString term) )
                ]



-- Functions


getTerm : Kind -> Term
getTerm kind =
    case kind of
        Decision version ->
            Term.Positive (Range.exact version)

        Derivation term _ ->
            term


finalDecision : Assignment -> Maybe { name : String, version : Version }
finalDecision { name, kind } =
    case kind of
        Decision version ->
            Just { name = name, version = version }

        _ ->
            Nothing


newDecision : String -> Version -> Int -> Assignment
newDecision name version decisionLevel =
    { name = name
    , decisionLevel = decisionLevel
    , kind = Decision version
    }


newDerivation : String -> Term -> Int -> Incompatibility -> Assignment
newDerivation name term decisionLevel cause =
    { name = name
    , decisionLevel = decisionLevel
    , kind = Derivation term { cause = cause }
    }
