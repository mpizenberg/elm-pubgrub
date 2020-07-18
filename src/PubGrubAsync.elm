module PubGrubAsync exposing (PackagesConfig, Solution, solveSync)

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

@docs PackagesConfig, Solution, solveSync

-}

import Incompatibility
import PartialSolution
import PubGrub
import Range exposing (Range)
import Term exposing (Term)
import Version exposing (Version)


type Model
    = Solving String PubGrub.Model
    | Finished (Result String Solution)


{-| Solution of the algorithm containing the list of required packages
with their version number.
-}
type alias Solution =
    List ( String, Version )


type Msg
    = NoMsg
    | Solve String Version
    | AvailableVersions String Term (List Version)
    | PackageDependencies String Version (Maybe (List ( String, Range )))


type Effect
    = NoEffect
    | ListVersions ( String, Term )
    | RetrieveDependencies ( String, Version )


{-| Configuration of available packages to solve dependencies.
-}
type alias PackagesConfig =
    { listAvailableVersions : String -> List Version
    , getDependencies : String -> Version -> Maybe (List ( String, Range ))
    }


{-| PubGrub version solving algorithm.
-}
solveSync : PackagesConfig -> String -> Version -> Result String Solution
solveSync config root version =
    solveRec root root (PubGrub.init root version)
        |> updateUntilFinished config


updateUntilFinished : PackagesConfig -> ( Model, Effect ) -> Result String Solution
updateUntilFinished config ( model, effect ) =
    case model of
        Solving _ _ ->
            updateUntilFinished config (update (performSync config effect) model)

        Finished finished ->
            finished


performSync : PackagesConfig -> Effect -> Msg
performSync config effect =
    case effect of
        NoEffect ->
            NoMsg

        ListVersions ( package, term ) ->
            AvailableVersions package term (config.listAvailableVersions package)

        RetrieveDependencies ( package, version ) ->
            config.getDependencies package version
                |> PackageDependencies package version


update : Msg -> Model -> ( Model, Effect )
update msg model =
    case ( msg, model ) of
        ( Solve root version, _ ) ->
            solveRec root root (PubGrub.init root version)

        ( AvailableVersions package term versions, Solving root pgModel ) ->
            case PubGrub.pickVersion versions term of
                Just version ->
                    ( model, RetrieveDependencies ( package, version ) )

                Nothing ->
                    let
                        noVersionIncompat =
                            Incompatibility.noVersion package term

                        updatedModel =
                            PubGrub.mapIncompatibilities (Incompatibility.merge noVersionIncompat) pgModel
                    in
                    solveRec root package updatedModel

        ( PackageDependencies package version maybeDependencies, Solving root pgModel ) ->
            case maybeDependencies of
                Nothing ->
                    Debug.todo "The package and version should exist!"

                Just deps ->
                    applyDecision deps package version pgModel
                        |> solveRec root package

        ( _, Finished _ ) ->
            ( model, NoEffect )

        _ ->
            Debug.todo ("This should not happen, " ++ Debug.toString msg ++ "\n" ++ Debug.toString model)


applyDecision : List ( String, Range ) -> String -> Version -> PubGrub.Model -> PubGrub.Model
applyDecision dependencies package version pgModel =
    let
        depIncompats =
            Incompatibility.fromDependencies package version dependencies

        _ =
            Debug.log ("Add the following " ++ String.fromInt (List.length depIncompats) ++ " incompatibilities from dependencies of " ++ package) ""

        _ =
            depIncompats
                |> List.map (\i -> Debug.log (Incompatibility.toDebugString 1 3 i) "")

        updatedIncompatibilities =
            List.foldr Incompatibility.merge pgModel.incompatibilities depIncompats
    in
    case PartialSolution.addVersion package version depIncompats pgModel.partialSolution of
        Nothing ->
            PubGrub.setIncompatibilities updatedIncompatibilities pgModel

        Just updatedPartial ->
            PubGrub.Model updatedIncompatibilities updatedPartial


solveRec : String -> String -> PubGrub.Model -> ( Model, Effect )
solveRec root package pgModel =
    case PubGrub.unitPropagation root package pgModel of
        Err msg ->
            ( Finished (Err msg), NoEffect )

        Ok updatedModel ->
            case PubGrub.pickPackage updatedModel.partialSolution of
                Nothing ->
                    case PartialSolution.solution updatedModel.partialSolution of
                        Just solution ->
                            ( Finished (Ok solution), NoEffect )

                        Nothing ->
                            ( Finished (Err "How did we end up with no package to choose but no solution?"), NoEffect )

                Just packageAndTerm ->
                    ( Solving root updatedModel, ListVersions packageAndTerm )
