module API exposing (Msg(..), getDependencies)

import Elm.Project
import Http
import PubGrub.Version as Version exposing (Version)


type Msg
    = GotDeps String Version (Result Http.Error Elm.Project.Project)


{-| Retrieve dependencies of a given package thanks to package.elm-lang.org API.

Use cors-anywhere service to bypass the CORS error.

-}
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
