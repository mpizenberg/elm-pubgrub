module Utils exposing (SearchDecision(..), find)

import Pivot exposing (Pivot)


type SearchDecision b
    = GoLeft Int
      -- search left but do not discard current position
    | KeepGoLeft Int
    | GoRight Int
      -- search right but do not discard current position
    | KeepGoRight Int
    | Stop
    | Found b


find : ({ left : Int, right : Int } -> a -> List a -> SearchDecision b) -> List a -> Maybe b
find search list =
    case list of
        [] ->
            Nothing

        x :: xs ->
            findHelper search { left = 0, right = List.length xs } (Pivot.fromCons x xs)


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
