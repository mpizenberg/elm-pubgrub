module Solver exposing (Config, Strategy(..), defaultConfig, initCache, solve)

import Dict
import Elm.Version
import ElmPackages
import Project exposing (Project)
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Version as Version


type alias State =
    ()


type alias Config =
    { online : Bool
    , strategy : Strategy
    }


type Strategy
    = Newest
    | Oldest


defaultConfig : Config
defaultConfig =
    { online = False
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


solve : Project -> Config -> Cache -> ( State, Cmd msg )
solve project config cache =
    case project of
        Project.Package package version dependencies ->
            Debug.todo "TODO"

        Project.Application dependencies ->
            Debug.todo "TODO"
