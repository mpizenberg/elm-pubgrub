module Range exposing (Range, acceptVersion, between, equals, exact, getExactVersion, higherThan, intersection, lowerThan, negate, none, toDebugString, union)

import Version exposing (Version)


{-| Custom type to try expressing most ranges of versions expressions
that may occur during the PubGrub algorithm,
in the most efficient way possible for fast transformations.

The complement of a range for example (`negate` function)
is efficiently expressed just with the opposite variant.

The `Intersection` and `Union` variants are last resort escape hatches for when
a set of versions cannot be expressed directly with another range primitive.

-}
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
      -- For when the intersection cannot be reduced
      -- Added because otherwise example 2 cannot be solved
    | Intersection Range Range
    | Union Range Range



-- Constructors


none : Range
none =
    None


exact : Version -> Range
exact =
    Exact


higherThan : Version -> Range
higherThan =
    HigherThan


lowerThan : Version -> Range
lowerThan =
    LowerThan


between : Version -> Version -> Range
between =
    Between



-- Extract exact version


getExactVersion : Range -> Maybe Version
getExactVersion range =
    case range of
        Exact version ->
            Just version

        _ ->
            Nothing



-- Debug


toDebugString : Range -> String
toDebugString range =
    case range of
        None ->
            "∅"

        Any ->
            "∗"

        Exact v ->
            Version.toDebugString v

        DifferentThan v ->
            "/= " ++ Version.toDebugString v

        HigherThan v ->
            Version.toDebugString v ++ " <= v"

        LowerThan v ->
            "v < " ++ Version.toDebugString v

        Between v1 v2 ->
            Version.toDebugString v1 ++ " <= v < " ++ Version.toDebugString v2

        Outside v1 v2 ->
            "v < " ++ Version.toDebugString v1 ++ "  |  " ++ Version.toDebugString v2 ++ " <= v"

        Intersection r1 r2 ->
            "( " ++ toDebugString r1 ++ " ) ⋂  ( " ++ toDebugString r2 ++ " )"

        Union r1 r2 ->
            "( " ++ toDebugString r1 ++ " ) ⋃  ( " ++ toDebugString r2 ++ " )"



-- Functions


{-| Check if two ranges are equivalent.
Due to the `Intersection` and `Union` variants possibly being in non reduced forms,
this might fail in identifying equivalent ranges as such.
-}
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

        -- This might not be totally right?
        ( Intersection _ _, Intersection _ _ ) ->
            Debug.todo "Implement this in a correct way 'most of the time'"

        -- This might not be totally right?
        ( Union _ _, Union _ _ ) ->
            Debug.todo "Implement this in a correct way 'most of the time'"

        -- This might not be totally right?
        ( Intersection _ _, Union _ _ ) ->
            Debug.todo "Implement this in a correct way 'most of the time'"

        -- This might not be totally right?
        ( Union _ _, Intersection _ _ ) ->
            Debug.todo "Implement this in a correct way 'most of the time'"

        _ ->
            False


normalizedBetween : Version -> Version -> Range
normalizedBetween v1 v2 =
    if Version.higherThan v1 v2 then
        Between v1 v2

    else
        None


{-| Compute the union of two ranges.
Implementation based on the intersection of two ranges.
-}
union : Range -> Range -> Range
union r1 r2 =
    negate (intersection (negate r1) (negate r2))


{-| Compute the intersection of two ranges.
Use the `Intersection` or `Union` variants only as last resorts.
Try reducing the union into one of the simplest primitives.
-}
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

        ( DifferentThan v1, DifferentThan v2 ) ->
            if v1 == v2 then
                DifferentThan v1

            else if Version.higherThan v1 v2 then
                Union (LowerThan v1) (union (normalizedBetween (Version.bumpPatch v1) v2) (HigherThan (Version.bumpPatch v2)))

            else
                Union (LowerThan v2) (union (normalizedBetween (Version.bumpPatch v2) v1) (HigherThan (Version.bumpPatch v1)))

        ( DifferentThan v1, HigherThan v2 ) ->
            if Version.higherThan v1 v2 then
                r2

            else if Version.equals v1 v2 then
                HigherThan (Version.bumpPatch v2)

            else
                union (normalizedBetween v2 v1) (HigherThan (Version.bumpPatch v1))

        ( DifferentThan v1, LowerThan v2 ) ->
            if Version.higherThan v1 v2 then
                union (LowerThan v1) (normalizedBetween (Version.bumpPatch v1) v2)

            else
                r2

        ( DifferentThan v1, Between v2 v3 ) ->
            if Version.higherThan v1 v2 then
                r2

            else if Version.equals v1 v2 then
                normalizedBetween (Version.bumpPatch v1) v3

            else if Version.higherThan v1 v3 then
                union (Between v2 v1) (normalizedBetween (Version.bumpPatch v1) v3)

            else
                r2

        ( DifferentThan v1, Outside v2 v3 ) ->
            if Version.higherThan v1 v2 then
                Union (LowerThan v1) (union (normalizedBetween (Version.bumpPatch v1) v2) (HigherThan v3))

            else if Version.higherThan v1 v3 then
                r2

            else if Version.equals v1 v3 then
                Outside v2 (Version.bumpPatch v3)

            else
                Union (LowerThan v2) (Union (Between v3 v1) (HigherThan (Version.bumpPatch v1)))

        ( HigherThan v1, HigherThan v2 ) ->
            HigherThan (Version.max v1 v2)

        ( HigherThan v1, LowerThan v2 ) ->
            normalizedBetween v1 v2

        ( HigherThan v1, Between v2 v3 ) ->
            normalizedBetween (Version.max v1 v2) v3

        ( HigherThan v1, Outside v2 v3 ) ->
            if Version.higherThan v1 v2 then
                Union (Between v1 v2) (HigherThan v3)

            else
                HigherThan (Version.max v1 v3)

        ( LowerThan v1, LowerThan v2 ) ->
            LowerThan (Version.min v1 v2)

        ( LowerThan v1, Between v2 v3 ) ->
            normalizedBetween v2 (Version.min v1 v3)

        ( LowerThan v1, Outside v2 v3 ) ->
            if Version.higherThan v3 v1 then
                Union (LowerThan v2) (Between v3 v1)

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
                Union (Between v1 v3) (Between v4 v2)

            else if v1v3 then
                normalizedBetween v1 (Version.min v2 v3)

            else if v4v2 then
                normalizedBetween (Version.max v1 v4) v2

            else
                None

        ( Outside v1 v2, Outside v3 v4 ) ->
            if Version.higherThan v4 v1 then
                Union (LowerThan v3) (Union (Between v4 v1) (HigherThan v2))

            else if Version.higherThan v2 v3 then
                Union (LowerThan v1) (Union (Between v2 v3) (HigherThan v4))

            else
                Outside (Version.min v1 v3) (Version.max v2 v4)

        ( Intersection r11 r12, _ ) ->
            reduceIntersection (intersection r11 r2) (intersection r12 r2)

        ( Union r11 r12, _ ) ->
            reduceUnion (intersection r11 r2) (intersection r12 r2)

        _ ->
            intersection r2 r1


{-| Used internally instead of the `intersection` function for a recursive call
to avoid infinite loops.
-}
reduceIntersection : Range -> Range -> Range
reduceIntersection r1 r2 =
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

        ( DifferentThan v1, DifferentThan v2 ) ->
            if v1 == v2 then
                DifferentThan v1

            else if Version.higherThan v1 v2 then
                Union (LowerThan v1) (reduceUnion (normalizedBetween (Version.bumpPatch v1) v2) (HigherThan (Version.bumpPatch v2)))

            else
                Union (LowerThan v2) (reduceUnion (normalizedBetween (Version.bumpPatch v2) v1) (HigherThan (Version.bumpPatch v1)))

        ( DifferentThan v1, HigherThan v2 ) ->
            if Version.higherThan v1 v2 then
                r2

            else if Version.equals v1 v2 then
                HigherThan (Version.bumpPatch v2)

            else
                reduceUnion (normalizedBetween v2 v1) (HigherThan (Version.bumpPatch v1))

        ( DifferentThan v1, LowerThan v2 ) ->
            if Version.higherThan v1 v2 then
                reduceUnion (LowerThan v1) (normalizedBetween (Version.bumpPatch v1) v2)

            else
                r2

        ( DifferentThan v1, Between v2 v3 ) ->
            if Version.higherThan v1 v2 then
                r2

            else if Version.equals v1 v2 then
                normalizedBetween (Version.bumpPatch v1) v3

            else if Version.higherThan v1 v3 then
                reduceUnion (Between v2 v1) (normalizedBetween (Version.bumpPatch v1) v3)

            else
                r2

        ( DifferentThan v1, Outside v2 v3 ) ->
            if Version.higherThan v1 v2 then
                Union (LowerThan v1) (reduceUnion (normalizedBetween (Version.bumpPatch v1) v2) (HigherThan v3))

            else if Version.higherThan v1 v3 then
                r2

            else if Version.equals v1 v3 then
                Outside v2 (Version.bumpPatch v3)

            else
                Union (LowerThan v2) (Union (Between v3 v1) (HigherThan (Version.bumpPatch v1)))

        ( HigherThan v1, HigherThan v2 ) ->
            HigherThan (Version.max v1 v2)

        ( HigherThan v1, LowerThan v2 ) ->
            normalizedBetween v1 v2

        ( HigherThan v1, Between v2 v3 ) ->
            normalizedBetween (Version.max v1 v2) v3

        ( HigherThan v1, Outside v2 v3 ) ->
            if Version.higherThan v1 v2 then
                Union (Between v1 v2) (HigherThan v3)

            else
                HigherThan (Version.max v1 v3)

        ( LowerThan v1, LowerThan v2 ) ->
            LowerThan (Version.min v1 v2)

        ( LowerThan v1, Between v2 v3 ) ->
            normalizedBetween v2 (Version.min v1 v3)

        ( LowerThan v1, Outside v2 v3 ) ->
            if Version.higherThan v3 v1 then
                Union (LowerThan v2) (Between v3 v1)

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
                Union (Between v1 v3) (Between v4 v2)

            else if v1v3 then
                normalizedBetween v1 (Version.min v2 v3)

            else if v4v2 then
                normalizedBetween (Version.max v1 v4) v2

            else
                None

        ( Outside v1 v2, Outside v3 v4 ) ->
            if Version.higherThan v4 v1 then
                Union (LowerThan v3) (Union (Between v4 v1) (HigherThan v2))

            else if Version.higherThan v2 v3 then
                Union (LowerThan v1) (Union (Between v2 v3) (HigherThan v4))

            else
                Outside (Version.min v1 v3) (Version.max v2 v4)

        ( Intersection r11 r12, _ ) ->
            Intersection (reduceIntersection r11 r2) (reduceIntersection r12 r2)

        ( Union r11 r12, _ ) ->
            Union (reduceIntersection r11 r2) (reduceIntersection r12 r2)

        _ ->
            reduceIntersection r2 r1


reduceUnion : Range -> Range -> Range
reduceUnion r1 r2 =
    negate (reduceIntersection (negate r1) (negate r2))


{-| Get the complementary set of values for a given range.
This avoids computations thanks to the variants used in the custom `Range` type.
-}
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

        Intersection r1 r2 ->
            Union (negate r1) (negate r2)

        Union r1 r2 ->
            Intersection (negate r1) (negate r2)


{-| Check if a version is inside the set described by a given range.
-}
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

        Intersection r1 r2 ->
            acceptVersion version r1 && acceptVersion version r2

        Union r1 r2 ->
            acceptVersion version r1 || acceptVersion version r2
