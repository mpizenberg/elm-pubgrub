module API exposing (Msg(..), getDependencies)

import Http
import Json.Decode
import PubGrub.Version as Version exposing (Version)


type Msg
    = GotDeps (Result Http.Error String)


getDependencies : String -> Version -> Cmd Msg
getDependencies package version =
    Http.get
        { url = "https://package.elm-lang.org/packages/" ++ package ++ "/" ++ Version.toDebugString version ++ "/elm.json"
        , expect = Http.expectJson GotDeps Json.Decode.string
        }
