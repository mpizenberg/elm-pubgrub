module Solver exposing (Config, Strategy(..), defaultConfig, initCache)

import Cache exposing (Cache)
import Dict
import Elm.Version
import ElmPackages
import PubGrub
import Version


type alias Config =
    { connectivity : PubGrub.Connectivity
    , strategy : Strategy
    }


type Strategy
    = Newest
    | Oldest


defaultConfig : Config
defaultConfig =
    { connectivity = PubGrub.Offline
    , strategy = Newest
    }


initCache : Cache
initCache =
    Dict.foldl insertVersions Cache.empty ElmPackages.allPackages


insertVersions : String -> List Elm.Version.Version -> Cache -> Cache
insertVersions package versions cache =
    List.map (Elm.Version.toTuple >> Version.fromTuple) versions
        |> List.map (\v -> ( package, v ))
        |> (\l -> Cache.addPackageVersions l cache)
