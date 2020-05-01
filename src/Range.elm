module Range exposing (Range(..), acceptVersion, equals, intersection, negate, union)

import Version exposing (Version)


type Range
    = None
    | Any
    | Exact Version
    | DifferentThan Version
      -- lower bound included
    | HigherThan Version
    | LowerThan Version
      -- lower bound included such as: vLow <= v < vHigh
    | Between Version Version
    | Outside Version Version


equals : Range -> Range -> Bool
equals r1 r2 =
    case ( r1, r2 ) of
        ( None, None ) ->
            True

        ( Any, Any ) ->
            True

        ( Exact v1, Exact v2 ) ->
            Version.equals v1 v2

        ( DifferentThan v1, DifferentThan v2 ) ->
            Version.equals v1 v2

        ( HigherThan v1, HigherThan v2 ) ->
            Version.equals v1 v2

        ( LowerThan v1, LowerThan v2 ) ->
            Version.equals v1 v2

        ( Between v1 v2, Between v3 v4 ) ->
            Version.equals v1 v3 && Version.equals v2 v4

        ( Outside v1 v2, Outside v3 v4 ) ->
            Version.equals v1 v3 && Version.equals v2 v4

        _ ->
            False


normalizedBetween : Version -> Version -> Range
normalizedBetween v1 v2 =
    if Version.higherThan v1 v2 then
        Between v1 v2

    else
        None


union : Range -> Range -> Range
union r1 r2 =
    negate (intersection (negate r1) (negate r2))


intersection : Range -> Range -> Range
intersection r1 r2 =
    case ( r1, r2 ) of
        ( None, _ ) ->
            None

        ( _, None ) ->
            None

        ( Any, _ ) ->
            r2

        ( _, Any ) ->
            r1

        ( Exact v1, _ ) ->
            if acceptVersion v1 r2 then
                r1

            else
                None

        ( _, Exact v2 ) ->
            if acceptVersion v2 r1 then
                r2

            else
                None

        ( DifferentThan v1, _ ) ->
            if acceptVersion v1 r2 then
                Debug.todo "Not handling the case of a 'hole' in a set"

            else
                r2

        ( HigherThan v1, HigherThan v2 ) ->
            HigherThan (Version.max v1 v2)

        ( HigherThan v1, LowerThan v2 ) ->
            normalizedBetween v1 v2

        ( HigherThan v1, Between v2 v3 ) ->
            normalizedBetween (Version.max v1 v2) v3

        ( HigherThan v1, Outside v2 v3 ) ->
            if Version.lowerThan v2 v1 then
                Debug.todo "Not handling the union of two segments"

            else
                HigherThan (Version.max v1 v3)

        ( LowerThan v1, LowerThan v2 ) ->
            LowerThan (Version.min v1 v2)

        ( LowerThan v1, Between v2 v3 ) ->
            normalizedBetween v2 (Version.min v1 v3)

        ( LowerThan v1, Outside v2 v3 ) ->
            if Version.higherThan v3 v1 then
                Debug.todo "Not handling the union of two segments"

            else
                LowerThan (Version.min v1 v2)

        ( Between v1 v2, Between v3 v4 ) ->
            normalizedBetween (Version.max v1 v3) (Version.min v2 v4)

        ( Between v1 v2, Outside v3 v4 ) ->
            let
                v1v3 =
                    Version.higherThan v1 v3

                v4v2 =
                    Version.higherThan v4 v2
            in
            if v1v3 && v4v2 then
                Debug.todo "Not handling the union of two segments"

            else if v1v3 then
                normalizedBetween v1 (Version.min v2 v3)

            else if v4v2 then
                normalizedBetween (Version.max v1 v4) v2

            else
                None

        ( Outside v1 v2, Outside v3 v4 ) ->
            if Version.higherThan v4 v1 || Version.higherThan v2 v3 then
                Debug.todo "Not handling the union of two segments"

            else
                Outside (Version.min v1 v3) (Version.max v2 v4)

        _ ->
            intersection r2 r1


negate : Range -> Range
negate range =
    case range of
        None ->
            Any

        Any ->
            None

        Exact version ->
            DifferentThan version

        DifferentThan version ->
            Exact version

        HigherThan version ->
            LowerThan version

        LowerThan version ->
            HigherThan version

        Between vLow vHigh ->
            Outside vLow vHigh

        Outside vLow vHigh ->
            Between vLow vHigh


acceptVersion : Version -> Range -> Bool
acceptVersion version range =
    case range of
        None ->
            False

        Any ->
            True

        Exact v ->
            Version.equals v version

        DifferentThan v ->
            not (Version.equals v version)

        HigherThan v ->
            Version.equals v version
                || Version.higherThan v version

        LowerThan v ->
            Version.lowerThan v version

        Between vLow vHigh ->
            Version.equals vLow version
                || (Version.higherThan vLow version && Version.lowerThan vHigh version)

        Outside vLow vHigh ->
            Version.lowerThan vLow version
                || Version.equals vHigh version
                || Version.higherThan vHigh version
