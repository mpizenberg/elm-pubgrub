module Cache exposing
    ( Cache, empty, size
    , addDependencies, addPackageVersions
    , listVersions, listDependencies
    )

{-| Cache already loaded packages information.

@docs Cache, empty, size
@docs addDependencies, addPackageVersions
@docs listVersions, listDependencies

-}

import Array exposing (Array)
import Dict exposing (Dict)
import Range exposing (Range)
import Version exposing (Version)


{-| Cache holding already loaded packages information.
-}
type Cache
    = Cache
        { packagesRaw : Array ( String, Version )
        , packages : Dict String (List Version)
        , dependencies : Dict ( String, ( Int, Int, Int ) ) (List ( String, Range ))
        }


{-| Initial empty cache.
-}
empty : Cache
empty =
    Cache
        { packagesRaw = Array.empty
        , packages = Dict.empty
        , dependencies = Dict.empty
        }


{-| Number of unique package versions.
-}
size : Cache -> Int
size (Cache { packagesRaw }) =
    Array.length packagesRaw



-- Add stuff


{-| Add dependencies of a package to the cache.
-}
addDependencies : String -> Version -> List ( String, Range ) -> Cache -> Cache
addDependencies package version deps (Cache cache) =
    if Dict.member ( package, Version.toTuple version ) cache.dependencies then
        Cache cache

    else
        Cache { cache | dependencies = Dict.insert ( package, Version.toTuple version ) deps cache.dependencies }


{-| Add a list of packages and versions to the cache.
-}
addPackageVersions : List ( String, Version ) -> Cache -> Cache
addPackageVersions packagesVersions (Cache { packagesRaw, packages, dependencies }) =
    let
        ( updatedRaw, updatePackages ) =
            List.foldl addPackageVersion ( packagesRaw, packages ) packagesVersions
    in
    Cache
        { packagesRaw = updatedRaw
        , packages = updatePackages
        , dependencies = dependencies
        }


addPackageVersion :
    ( String, Version )
    -> ( Array ( String, Version ), Dict String (List Version) )
    -> ( Array ( String, Version ), Dict String (List Version) )
addPackageVersion ( package, version ) ( raw, packages ) =
    case Dict.get package packages of
        Nothing ->
            ( Array.push ( package, version ) raw
            , Dict.insert package [ version ] packages
            )

        Just versions ->
            if List.member version versions then
                ( raw, packages )

            else
                ( Array.push ( package, version ) raw
                , Dict.update package (Maybe.map ((::) version)) packages
                )



-- Read stuff


{-| List available versions of a package already in cache.
-}
listVersions : String -> Cache -> List Version
listVersions package (Cache { packages }) =
    -- TODO: put the cache as first argument
    Dict.get package packages
        |> Maybe.withDefault []


{-| List dependencies of a given package.
-}
listDependencies : String -> Version -> Cache -> Maybe (List ( String, Range ))
listDependencies package version (Cache { dependencies }) =
    -- TODO: put the cache as first argument
    Dict.get ( package, Version.toTuple version ) dependencies
