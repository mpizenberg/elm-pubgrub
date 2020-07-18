module PubGrubAsync exposing (solve)

{-| PubGrub version solving algorithm.

PubGrub is a version solving algorithm,
written in 2018 by Natalie Weizenbaum
for the Dart package manager.
It is supposed to be very fast and to explain errors
more clearly than the alternatives.
An introductory blog post was
[published on Medium][medium-pubgrub] by its author.

The detailed explanation of the algorithm is
[provided on GitHub][github-pubgrub].
The foundation of the algorithm is based on ASP (Answer Set Programming)
and a book called
"[Answer Set Solving in Practice][potassco-book]"
by Martin Gebser, Roland Kaminski, Benjamin Kaufmann and Torsten Schaub.

[medium-pubgrub]: https://medium.com/@nex3/pubgrub-2fb6470504f
[github-pubgrub]: https://github.com/dart-lang/pub/blob/master/doc/solver.md
[potassco-book]: https://potassco.org/book/

@docs solve

-}

import Database.Stub as Stub
import Incompatibility exposing (Incompatibility)
import PartialSolution exposing (PartialSolution)
import PubGrub
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)


type alias Model =
    { incompatibilities : List Incompatibility
    , partialSolution : PartialSolution
    }


init : String -> Version -> Model
init root version =
    { incompatibilities = [ Incompatibility.notRoot root version ]
    , partialSolution = PartialSolution.empty
    }


setIncompatibilities : List Incompatibility -> Model -> Model
setIncompatibilities incompatibilities model =
    { incompatibilities = incompatibilities
    , partialSolution = model.partialSolution
    }


mapIncompatibilities : (List Incompatibility -> List Incompatibility) -> Model -> Model
mapIncompatibilities f { incompatibilities, partialSolution } =
    { incompatibilities = f incompatibilities
    , partialSolution = partialSolution
    }


{-| PubGrub version solving algorithm.
-}
solve : String -> Version -> Result String (List ( String, Version ))
solve root version =
    solveRec root root (init root version)


solveRec : String -> String -> Model -> Result String (List ( String, Version ))
solveRec root package model =
    case PubGrub.unitPropagation root package model of
        Err msg ->
            Err msg

        Ok updatedModel ->
            case makeDecision Stub.listAvailableVersions updatedModel of
                Nothing ->
                    PartialSolution.solution updatedModel.partialSolution
                        |> Result.fromMaybe "Is this possible???"

                Just ( next, updatedAgainModel ) ->
                    solveRec root next updatedAgainModel


makeDecision : (String -> List Version) -> Model -> Maybe ( String, Model )
makeDecision listAvailableVersions model =
    case pickPackageVersion model.partialSolution listAvailableVersions of
        Nothing ->
            Nothing

        Just (Err ( package, incompat )) ->
            Just ( package, mapIncompatibilities (Incompatibility.merge incompat) model )

        Just (Ok ( package, version )) ->
            let
                dependencies =
                    case Stub.getDependencies package version of
                        Just deps ->
                            deps

                        Nothing ->
                            Debug.todo "The package and version should exist"

                depIncompats =
                    Incompatibility.fromDependencies package version dependencies

                _ =
                    Debug.log ("Add the following " ++ String.fromInt (List.length depIncompats) ++ " incompatibilities from dependencies of " ++ package) ""

                _ =
                    depIncompats
                        |> List.map (\i -> Debug.log (Incompatibility.toDebugString 1 3 i) "")

                updatedIncompatibilities =
                    List.foldr Incompatibility.merge model.incompatibilities depIncompats
            in
            case PartialSolution.addVersion package version depIncompats model.partialSolution of
                Nothing ->
                    Just ( package, setIncompatibilities updatedIncompatibilities model )

                Just updatedPartial ->
                    Just ( package, Model updatedIncompatibilities updatedPartial )


{-| Heuristic to pick the next package & version to add to the partial solution.
This should be a package with a positive derivation but no decision yet.
If multiple choices are possible, use a heuristic.

Pub chooses the latest matching version of the package
with the fewest versions that match the outstanding constraint.
This tends to find conflicts earlier if any exist,
since these packages will run out of versions to try more quickly.
But there's likely room for improvement in these heuristics.

Let "term" be the intersection of all assignments in the partial solution
referring to that package.
If no version matches that term return an error with
the package name and the incompatibity {term}.

-}
pickPackageVersion : PartialSolution -> (String -> List Version) -> Maybe (Result ( String, Incompatibility ) ( String, Version ))
pickPackageVersion partial listAvailableVersions =
    case PubGrub.pickPackage partial of
        Just ( package, term ) ->
            PubGrub.pickVersion (listAvailableVersions package) term
                |> Maybe.map (Tuple.pair package)
                |> Result.fromMaybe ( package, Incompatibility.noVersion package term )
                |> Just

        Nothing ->
            Nothing
