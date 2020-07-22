module API exposing (Msg(..), getDependencies)

import Elm.Project
import Http
import PubGrub.Version as Version exposing (Version)


type Msg
    = GotDeps String Version (Result Http.Error Elm.Project.Project)


getDependencies : String -> Version -> Cmd Msg
getDependencies package version =
    Http.get
        { url =
            "https://cors-anywhere.herokuapp.com/"
                ++ "https://package.elm-lang.org/packages/"
                ++ package
                ++ "/"
                ++ Version.toDebugString version
                ++ "/elm.json"
        , expect = Http.expectJson (GotDeps package version) Elm.Project.decoder
        }



-- Http.request
--     { method = "GET"
--     , headers = [ Http.header "accept-encoding" "gzip" ]
--     , url = "https://package.elm-lang.org/packages/" ++ package ++ "/" ++ Version.toDebugString version ++ "/elm.json"
--     , body = Http.emptyBody
--     , expect = Http.expectJson GotDeps Json.Decode.string
--     , timeout = Nothing
--     , tracker = Nothing
--     }
