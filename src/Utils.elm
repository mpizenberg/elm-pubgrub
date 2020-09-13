module Utils exposing (dictAll, dictAny, dictFilterMap)

import Dict exposing (Dict)



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
