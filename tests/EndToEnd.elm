module EndToEnd exposing (..)

import Examples
import Expect
import PubGrub
import PubGrub.Version as Version
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
