module Database.ElmJson exposing (Packages, init)

{-| Pre-loaded package dependencies for most used Elm packages.
(NOT USED YET, I'm still in the debugging stage with handcrafted
examples stored in Database.Stub.

@docs Packages, init

-}

import Dict exposing (Dict)
import Elm.Project exposing (Project)
import Json.Decode


{-| Representation of the whole set of packages.
-}
type alias Packages =
    Dict ( String, ( Int, Int, Int ) ) Project


{-| Initial set of preloaded packages.
-}
init : Packages
init =
    Dict.fromList
        [ ( ( "elm/core", ( 1, 0, 0 ) ), elmCore100 )
        , ( ( "elm/core", ( 1, 0, 1 ) ), elmCore101 )
        ]


default : Project
default =
    Debug.todo "default"



-- Manually added (most used) packages
--
-- elm/core
-- elm/json
-- elm/html
-- elm/time
-- elm/browser
-- elm/regex
-- elm/svg
-- elm/http
-- elm/url
-- elm-community/list-extra
-- elm/parser
-- elm/random
-- elm/bytes
-- avh4/elm-color
-- elm/virtual-dom
-- NoRedInk/elm-json-decode-pipeline
-- rtfeldman/elm-css
-- elm-explorations/test
-- elm-community/maybe-extra
-- elm-community/json-extra
-- rtfeldman/elm-hex
-- rtfeldman/elm-iso8601-date-strings
-- nikita-volkov/typeclasses
-- elm/file
-- debois/elm-dom
-- truqu/elm-base64
-- justinmimbs/date
-- justinmimbs/time-extra
-- mdgriffith/elm-ui
-- myrho/elm-round
-- ktonon/elm-word
-- zwilias/elm-utf-tools
-- ianmackenzie/elm-geometry
-- Skinney/murmur3
-- andre-dietrich/parser-combinators
-- pzp1997/assoc-list
-- elm-community/typed-svg
-- krisajenkins/remotedata
-- ianmackenzie/elm-float-extra
-- elm-explorations/linear-algebra
-- ryannhg/date-format
-- mpizenberg/elm-pointer-even


elmCore100 =
    Result.withDefault default <|
        Json.Decode.decodeString Elm.Project.decoder """
{
        "type": "package",
        "name": "elm/core",
        "summary": "Elm's standard libraries",
        "license": "BSD-3-Clause",
        "version": "1.0.0",
        "exposed-modules": {
                "Primitives": [
                        "Basics",
                        "String",
                        "Char",
                        "Bitwise",
                        "Tuple"
                ],
                "Collections": [
                        "List",
                        "Dict",
                        "Set",
                        "Array"
                ],
                "Error Handling": [
                        "Maybe",
                        "Result"
                ],
                "Debug": [
                        "Debug"
                ],
                "Effects": [
                        "Platform",
                        "Platform.Cmd",
                        "Platform.Sub",
                        "Task",
                        "Process"
                ]
        },
        "elm-version": "0.19.0 <= v < 0.20.0",
        "dependencies": {},
        "test-dependencies": {}
}
"""


elmCore101 =
    Result.withDefault default <|
        Json.Decode.decodeString Elm.Project.decoder """
{
        "type": "package",
        "name": "elm/core",
        "summary": "Elm's standard libraries",
        "license": "BSD-3-Clause",
        "version": "1.0.1",
        "exposed-modules": {
                "Primitives": [
                        "Basics",
                        "String",
                        "Char",
                        "Bitwise",
                        "Tuple"
                ],
                "Collections": [
                        "List",
                        "Dict",
                        "Set",
                        "Array"
                ],
                "Error Handling": [
                        "Maybe",
                        "Result"
                ],
                "Debug": [
                        "Debug"
                ],
                "Effects": [
                        "Platform.Cmd",
                        "Platform.Sub",
                        "Platform",
                        "Process",
                        "Task"
                ]
        },
        "elm-version": "0.19.0 <= v < 0.20.0",
        "dependencies": {},
        "test-dependencies": {}
}
"""
