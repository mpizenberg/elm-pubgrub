module EndToEnd exposing (..)

import Database.Stub as Stub
import Expect
import PubGrub
import Test exposing (Test)
import Version


noConflict : Test
noConflict =
    Test.test "A simple case where no actual conflicts occur" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions1
                , getDependencies = Stub.getDependencies1
                }
                "root"
                Version.one
                |> Expect.ok


avoidingConflictDuringDecisionMaking : Test
avoidingConflictDuringDecisionMaking =
    Test.test "decision making examines a package version that would cause a conflict and chooses not to select it" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions2
                , getDependencies = Stub.getDependencies2
                }
                "root"
                Version.one
                |> Expect.ok


performingConflictResolution : Test
performingConflictResolution =
    Test.test "full conflict resolution" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions3
                , getDependencies = Stub.getDependencies3
                }
                "root"
                Version.one
                |> Expect.ok


conflictResolutionWithPartialSatisfier : Test
conflictResolutionWithPartialSatisfier =
    Test.test "conflict resolution where the term in question isn't totally satisfied by a single satisfier" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions4
                , getDependencies = Stub.getDependencies4
                }
                "root"
                Version.one
                |> Expect.ok


linearErrorReporting : Test
linearErrorReporting =
    Test.test "error reporting when the derivation graph is straightforwardly linear" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions5
                , getDependencies = Stub.getDependencies5
                }
                "root"
                Version.one
                |> Expect.err


priorCauseOldBug5bis : Test
priorCauseOldBug5bis =
    Test.test "See PR 5: https://github.com/mpizenberg/elm-pubgrub/pull/5" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions5
                , getDependencies = Stub.getDependencies5
                }
                "root"
                Version.one
                |> Expect.err


branchingErrorReporting : Test
branchingErrorReporting =
    Test.test "too complex to explain in a linear chain of reasoning" <|
        \_ ->
            PubGrub.solve
                { listAvailableVersions = Stub.listAvailableVersions6
                , getDependencies = Stub.getDependencies6
                }
                "root"
                Version.one
                |> Expect.err
