module EndToEnd exposing (..)

import Examples
import Expect
import Fuzz
import Minithesis as M
import Minithesis.Fuzz as MF
import PubGrub
import PubGrub.Cache as Cache exposing (Cache)
import PubGrub.Version as Version
import PubGrubFuzz
import Test exposing (Test)


noConflict : Test
noConflict =
    Test.test "A simple case where no actual conflicts occur" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions1
                , getDependencies = Examples.getDependencies1
                }
                "root"
                Version.one
                |> Expect.ok


avoidingConflictDuringDecisionMaking : Test
avoidingConflictDuringDecisionMaking =
    Test.test "decision making examines a package version that would cause a conflict and chooses not to select it" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions2
                , getDependencies = Examples.getDependencies2
                }
                "root"
                Version.one
                |> Expect.ok


performingConflictResolution : Test
performingConflictResolution =
    Test.test "full conflict resolution" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions3
                , getDependencies = Examples.getDependencies3
                }
                "root"
                Version.one
                |> Expect.ok


conflictResolutionWithPartialSatisfier : Test
conflictResolutionWithPartialSatisfier =
    Test.test "conflict resolution where the term in question isn't totally satisfied by a single satisfier" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions4
                , getDependencies = Examples.getDependencies4
                }
                "root"
                Version.one
                |> Expect.ok


linearErrorReporting : Test
linearErrorReporting =
    Test.test "error reporting when the derivation graph is straightforwardly linear" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions5
                , getDependencies = Examples.getDependencies5
                }
                "root"
                Version.one
                |> Expect.err


priorCauseOldBug5bis : Test
priorCauseOldBug5bis =
    Test.test "See PR 5: https://github.com/mpizenberg/elm-pubgrub/pull/5" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions5
                , getDependencies = Examples.getDependencies5
                }
                "root"
                Version.one
                |> Expect.err


branchingErrorReporting : Test
branchingErrorReporting =
    Test.test "too complex to explain in a linear chain of reasoning" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions6
                , getDependencies = Examples.getDependencies6
                }
                "root"
                Version.one
                |> Expect.err


transitiveDependencyToIncompatibleRoot : Test
transitiveDependencyToIncompatibleRoot =
    Test.test "Should pass even if a wrong transitive dependency tries to depend on root 2.0.0" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Examples.listAvailableVersions7
                , getDependencies = Examples.getDependencies7
                }
                "root"
                Version.one
                |> Expect.ok



-- Fuzz tests


correlatedDependencies : Test
correlatedDependencies =
    Test.fuzz Fuzz.int "correlatedDependencies" <|
        \seed ->
            -- Change maxExamples to augment the number of tests
            M.runWith { maxExamples = 100, showShrinkHistory = False } seed (solveNoUnexpected PubGrubFuzz.correlatedDependencies)
                |> Tuple.second
                |> Expect.equal M.Passes


uncorrelatedDependencies : Test
uncorrelatedDependencies =
    Test.fuzz Fuzz.int "uncorrelatedDependencies" <|
        \seed ->
            M.run seed (solveNoUnexpected PubGrubFuzz.uncorrelatedDependencies)
                |> Tuple.second
                |> Expect.equal M.Passes


emptyDependencies : Test
emptyDependencies =
    Test.fuzz Fuzz.int "emptyDependencies" <|
        \seed ->
            M.run seed (solveSuccess PubGrubFuzz.emptyDependencies)
                |> Tuple.second
                |> Expect.equal M.Passes



-- Fuzz helpers


solveNoUnexpected : MF.Fuzzer PubGrubFuzz.Dependencies -> M.Test PubGrubFuzz.Dependencies
solveNoUnexpected depsFuzzer =
    M.test "solveWithoutUnexpectedResult" depsFuzzer <|
        \dependencies ->
            let
                config =
                    packagesConfigFromDependencies dependencies
            in
            -- Try to solve dependencies for all packages.
            -- They should all succeed.
            List.all (\( ( p, v ), _ ) -> noUnexpected (PubGrub.solve config p v)) dependencies


noUnexpected : Result String PubGrub.Solution -> Bool
noUnexpected res =
    case res of
        Err "How did we end up with no package to choose but no solution?" ->
            False

        Err "This should never happen, rootCause is guaranted to be almost satisfied by the partial solution" ->
            False

        _ ->
            True


solveSuccess : MF.Fuzzer PubGrubFuzz.Dependencies -> M.Test PubGrubFuzz.Dependencies
solveSuccess depsFuzzer =
    M.test "solveWithOkResult" depsFuzzer <|
        \dependencies ->
            let
                config =
                    packagesConfigFromDependencies dependencies
            in
            -- Try to solve dependencies for all packages.
            -- They should all succeed.
            List.all (\( ( p, v ), _ ) -> isOk (PubGrub.solve config p v)) dependencies


isOk : Result err value -> Bool
isOk res =
    case res of
        Ok _ ->
            True

        _ ->
            False


packagesConfigFromDependencies : PubGrubFuzz.Dependencies -> PubGrub.PackagesConfig
packagesConfigFromDependencies deps =
    PubGrub.packagesConfigFromCache (cacheFromDeps deps)


cacheFromDeps : PubGrubFuzz.Dependencies -> Cache
cacheFromDeps dependencies =
    List.foldl
        (\( ( p, v ), pDeps ) cache ->
            Cache.addPackageVersions [ ( p, v ) ] cache
                |> Cache.addDependencies p v pDeps
        )
        Cache.empty
        dependencies
