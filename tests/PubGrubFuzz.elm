module PubGrubFuzz exposing
    ( Dependencies
    , correlatedDependencies
    , emptyDependencies
    , name
    , range
    , uncorrelatedDependencies
    , version
    )

import Minithesis.Fuzz as MF
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)


type alias Dependencies =
    List ( ( String, Version ), List ( String, Range ) )


{-| Names of packages are the same that those of dependencies.
-}
correlatedDependencies : MF.Fuzzer Dependencies
correlatedDependencies =
    MF.list name
        |> MF.andThen
            (\packages ->
                fromList <|
                    List.map
                        (\p ->
                            MF.tuple
                                (MF.tuple (MF.constant p) version)
                                (dependenciesFrom packages)
                        )
                        packages
            )


dependenciesFrom : List String -> MF.Fuzzer (List ( String, Range ))
dependenciesFrom packages =
    MF.uniqueByList Tuple.first (MF.tuple (MF.oneOfValues packages) range)


namesFrom : List String -> MF.Fuzzer (List String)
namesFrom names =
    MF.uniqueList (MF.oneOfValues names)


fromList : List (MF.Fuzzer a) -> MF.Fuzzer (List a)
fromList =
    List.foldr (MF.map2 (::)) (MF.constant [])


{-| Names of packages and their dependencies are not correlated,
so most probably, this will lead to an unsolvable set of dependencies.
-}
uncorrelatedDependencies : MF.Fuzzer Dependencies
uncorrelatedDependencies =
    MF.list (MF.tuple packageVersion (MF.list packageRange))


emptyDependencies : MF.Fuzzer Dependencies
emptyDependencies =
    MF.list (MF.tuple packageVersion (MF.constant []))


{-| Random package name and range
-}
packageRange : MF.Fuzzer ( String, Range )
packageRange =
    MF.tuple name range


{-| Random package name and version
-}
packageVersion : MF.Fuzzer ( String, Version )
packageVersion =
    MF.tuple name version


{-| String with 3 times less chance to be empty
-}
name : MF.Fuzzer String
name =
    MF.string
        |> MF.andThen
            (\s1 ->
                if String.isEmpty s1 then
                    MF.string
                        |> MF.andThen
                            (\s2 ->
                                if String.isEmpty s2 then
                                    MF.string

                                else
                                    MF.constant s2
                            )

                else
                    MF.constant s1
            )


range : MF.Fuzzer Range
range =
    MF.map2
        (\v1 v2 -> Range.between (Version.min v1 v2) (Version.max v1 v2))
        version
        version


version : MF.Fuzzer Version
version =
    MF.map3 Version.new_ positive positive positive


positive : MF.Fuzzer Int
positive =
    MF.int 0 100
