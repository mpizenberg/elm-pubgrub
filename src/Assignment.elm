module Assignment exposing
    ( Assignment, Kind(..)
    , newDecision, newDerivation
    , getTerm, encodeDebug
    )

{-| This is a helper module around `Assignment`,
the building block of a PubGrub partial solution
(partial solution = the current state of the "solution" we are building in the algorithm).

@docs Assignment, Kind

@docs newDecision, newDerivation

@docs getTerm, encodeDebug

-}

import Incompatibility exposing (Incompatibility)
import Json.Encode exposing (Value)
import Range
import Term exposing (Term)
import Version exposing (Version)


{-| An assignment refers to a given package (`name : String`) and can either be
(1) a decision, which is a chosen version,
or (2) a derivation, which is a `Term` specifying compatible versions.

A `decisionLevel` records how many decisions have already been taken,
including this one if it is a decision.

-}
type alias Assignment =
    { name : String
    , decisionLevel : Int
    , kind : Kind
    }


{-| An assignment is either a decision, with the chosen version,
or a derivation term, specifying compatible versions
according to previous assignments and all incompatibilities.
We also record the incompatibility responsible for
that derivation term as its "cause".
-}
type Kind
    = Decision Version
    | Derivation Term { cause : Incompatibility }



-- Debug


{-| Encode an assignment into a JavaScript Value.
-}
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

        Derivation term { cause } ->
            Json.Encode.object
                [ ( "kind", Json.Encode.string "Derivation" )
                , ( "name", Json.Encode.string name )
                , ( "decisionLevel", Json.Encode.int decisionLevel )
                , ( "term", Json.Encode.string (Term.toDebugString term) )
                , ( "cause", Json.Encode.string (Incompatibility.toDebugString 1 0 cause) )
                ]



-- Functions


{-| Retrieve the current assignment as a `Term`.
If this is decision, it returns a positive term with that exact version.
Otherwise, if this is a derivation, just returns its term.
-}
getTerm : Kind -> Term
getTerm kind =
    case kind of
        Decision version ->
            Term.Positive (Range.exact version)

        Derivation term _ ->
            term


{-| Constructor for a decision.
-}
newDecision : String -> Version -> Int -> Assignment
newDecision name version decisionLevel =
    { name = name
    , decisionLevel = decisionLevel
    , kind = Decision version
    }


{-| Constructor for a derivation.
-}
newDerivation : String -> Term -> Int -> Incompatibility -> Assignment
newDerivation name term decisionLevel cause =
    { name = name
    , decisionLevel = decisionLevel
    , kind = Derivation term { cause = cause }
    }
