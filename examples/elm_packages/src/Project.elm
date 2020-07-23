module Project exposing (Project(..), fromElmProject)

import Elm.Constraint
import Elm.Package
import Elm.Project
import Elm.Version
import PubGrub.Range as Range exposing (Range)
import PubGrub.Version as Version exposing (Version)



-- TODO: Add the Elm version to the dependencies (0.19 etc)


{-| A project is either a package at a given version with given dependencies,
or an application with given dependencies.
-}
type Project
    = Package String Version (List ( String, Range ))
    | Application (List ( String, Range ))


{-| Convert the Project type from elm/project-metadata-utils
into our Project type that only care about direct dependencies.
-}
fromElmProject : Elm.Project.Project -> Project
fromElmProject elmProject =
    case elmProject of
        Elm.Project.Package { name, version, deps } ->
            let
                package =
                    Elm.Package.toString name

                packageVersion =
                    Version.fromTuple (Elm.Version.toTuple version)

                dependencies =
                    deps
                        |> List.map (Tuple.mapFirst Elm.Package.toString)
                        |> List.map (Tuple.mapSecond (Elm.Constraint.toString >> rangeFromString))
            in
            Package package packageVersion dependencies

        Elm.Project.Application { depsDirect } ->
            depsDirect
                |> List.map (Tuple.mapFirst Elm.Package.toString)
                |> List.map (Tuple.mapSecond (Elm.Version.toTuple >> Version.fromTuple >> Range.exact))
                |> Application


rangeFromString : String -> Range
rangeFromString str =
    case String.split " " str of
        low :: sep1 :: _ :: sep2 :: high :: [] ->
            case ( Elm.Version.fromString low, Elm.Version.fromString high ) of
                ( Just vLow, Just vHigh ) ->
                    let
                        v1 =
                            Version.fromTuple (Elm.Version.toTuple vLow)

                        v2 =
                            Version.fromTuple (Elm.Version.toTuple vHigh)

                        range1 =
                            if sep1 == "<=" then
                                Range.higherThan v1

                            else
                                Range.higherThan (Version.bumpPatch v1)

                        range2 =
                            if sep2 == "<" then
                                Range.lowerThan v2

                            else
                                Range.lowerThan (Version.bumpPatch v2)
                    in
                    Range.intersection range1 range2

                _ ->
                    Debug.todo "Elm version should be correctly formatted"

        _ ->
            Debug.todo "Elm constraint should be correctly formatted"
