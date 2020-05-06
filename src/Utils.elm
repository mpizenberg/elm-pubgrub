module Utils exposing (SearchDecision(..), dictAll, dictAny, dictFilterMap, find)

import Dict exposing (Dict)
import Pivot exposing (Pivot)



-- Dict


dictFilterMap : (comparable -> a -> Maybe b) -> Dict comparable a -> Dict comparable b
dictFilterMap f dict =
    Dict.foldl
        (\k v acc ->
            case f k v of
                Just newVal ->
                    Dict.insert k newVal acc

                Nothing ->
                    acc
        )
        Dict.empty
        dict


dictAny : (comparable -> a -> Bool) -> Dict comparable a -> Bool
dictAny predicate dict =
    Dict.foldl (\k v acc -> acc || predicate k v) False dict


dictAll : (comparable -> a -> Bool) -> Dict comparable a -> Bool
dictAll predicate dict =
    Dict.foldl (\k v acc -> acc && predicate k v) True dict



-- Search


{-| Custom type for a generic searching algorithm over a list zipper.
-}
type SearchDecision b
    = GoLeft Int
      -- search left but do not discard current position
    | KeepGoLeft Int
    | GoRight Int
      -- search right but do not discard current position
    | KeepGoRight Int
    | Stop
    | Found b


{-| Fast and customizable searching algorithm on lists, based on a list zipper.
The stepping search function takes as argument the bounds of searchable values,
as well as the current value evaluated and all the rest of the right list
(even after the right bound).

This enables efficient search algorithms that need access to all the rest of the list
such as the one looking for the "satisfier" assignment of a partial solution.

-}
find : ({ left : Int, right : Int } -> a -> List a -> SearchDecision b) -> List a -> Maybe b
find search list =
    case list of
        [] ->
            Nothing

        x :: xs ->
            findHelper search { left = 0, right = List.length xs } (Pivot.fromCons x xs)


{-| Move over the Zipper in a given direction
and update accordingly the right and left limits.

In case of KeepGoLeft or KeepGoRight,
keep the current cursor in bounds for the next step,
otherwise it is discarded.

-}
findHelper :
    ({ left : Int, right : Int } -> a -> List a -> SearchDecision b)
    -> { left : Int, right : Int }
    -> Pivot a
    -> Maybe b
findHelper search ({ left, right } as sizes) zip =
    case search sizes (Pivot.getC zip) (Pivot.getR zip) of
        Stop ->
            Nothing

        Found b ->
            Just b

        GoLeft step ->
            case Pivot.goRelative -step zip of
                Nothing ->
                    Nothing

                Just newZip ->
                    findHelper search { left = left - step, right = step - 1 } newZip

        KeepGoLeft step ->
            case Pivot.goRelative -step zip of
                Nothing ->
                    Nothing

                Just newZip ->
                    findHelper search { left = left - step, right = step } newZip

        GoRight step ->
            case Pivot.goRelative step zip of
                Nothing ->
                    Nothing

                Just newZip ->
                    findHelper search { left = step - 1, right = right - step } newZip

        KeepGoRight step ->
            case Pivot.goRelative step zip of
                Nothing ->
                    Nothing

                Just newZip ->
                    findHelper search { left = step, right = right - step } newZip
