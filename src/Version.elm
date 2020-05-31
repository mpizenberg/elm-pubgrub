module Version exposing
    ( Version, toDebugString, toTuple
    , zero, one, two, three
    , new, new_, fromTuple
    , bumpPatch, bumpMinor, bumpMajor
    , max, min, higherThan, lowerThan
    )

{-| Versions following the semantic versioning scheme of
Major.Minor.Patch.
This module provides functions to create and compare versions.

@docs Version, toDebugString, toTuple


# Predefined versions

@docs zero, one, two, three


# Create a new version

@docs new, new_, fromTuple


# Bump versions

@docs bumpPatch, bumpMinor, bumpMajor


# Compare versions

@docs max, min, higherThan, lowerThan

-}


{-| Type for semantic versions.
-}
type Version
    = Version
        { major : Int
        , minor : Int
        , patch : Int
        }



-- Debug


{-| Displayable String representation of versions, for debug purposes.
-}
toDebugString : Version -> String
toDebugString (Version { major, minor, patch }) =
    [ major, minor, patch ]
        |> List.map String.fromInt
        |> String.join "."



-- Constructor


{-| Version 0.0.0
-}
zero : Version
zero =
    Version { major = 0, minor = 0, patch = 0 }


{-| Version 1.0.0
-}
one : Version
one =
    Version { major = 1, minor = 0, patch = 0 }


{-| Version 2.0.0
-}
two : Version
two =
    Version { major = 2, minor = 0, patch = 0 }


{-| Version 3.0.0
-}
three : Version
three =
    Version { major = 3, minor = 0, patch = 0 }


{-| Create a version with the given major, minor,
and patch values `v = major.minor.patch`.
Negative values are set to 0.
-}
new : { major : Int, minor : Int, patch : Int } -> Version
new { major, minor, patch } =
    Version
        { major = Basics.max 0 major
        , minor = Basics.max 0 minor
        , patch = Basics.max 0 patch
        }


{-| Alternative constructor.

    new_ mj mn p == new { major = mj, minor = mn, patch = p }

-}
new_ : Int -> Int -> Int -> Version
new_ major minor patch =
    new { major = major, minor = minor, patch = patch }


{-| Alternative constructor from a tuple.

    fromTuple ( mj, mn, p ) == new_ mj mn p

-}
fromTuple : ( Int, Int, Int ) -> Version
fromTuple ( major, minor, patch ) =
    new { major = major, minor = minor, patch = patch }


{-| Bump major number of a version.

    bumpMajor (new_ 1 0 3) == new_ 2 0 0

-}
bumpMajor : Version -> Version
bumpMajor (Version { major }) =
    Version
        { major = major + 1
        , minor = 0
        , patch = 0
        }


{-| Bump minor number of a version.

    bumpMinor (new_ 1 0 3) == new_ 1 1 0

-}
bumpMinor : Version -> Version
bumpMinor (Version { major, minor }) =
    Version
        { major = major
        , minor = minor + 1
        , patch = 0
        }


{-| Bump patch number of a version.

    bumpPatch (new_ 1 0 3) == new_ 1 0 4

-}
bumpPatch : Version -> Version
bumpPatch (Version { major, minor, patch }) =
    Version
        { major = major
        , minor = minor
        , patch = patch + 1
        }


{-| Retrieve a version as a tuple.
-}
toTuple : Version -> ( Int, Int, Int )
toTuple (Version { major, minor, patch }) =
    ( major, minor, patch )



-- Comparisons


{-| Check if a version is strictly higher than another version.
-}
higherThan : Version -> Version -> Bool
higherThan (Version v) (Version vRef) =
    if vRef.major > v.major then
        True

    else if vRef.major < v.major then
        False

    else if vRef.minor > v.minor then
        True

    else if vRef.minor < v.minor then
        False

    else
        vRef.patch > v.patch


{-| Check if a version is strictly lower than another version.
-}
lowerThan : Version -> Version -> Bool
lowerThan (Version v) (Version vRef) =
    if vRef.major > v.major then
        False

    else if vRef.major < v.major then
        True

    else if vRef.minor > v.minor then
        False

    else if vRef.minor < v.minor then
        True

    else
        vRef.patch < v.patch


{-| Return the highest of two versions.
-}
max : Version -> Version -> Version
max v1 v2 =
    if higherThan v1 v2 then
        v2

    else
        v1


{-| Return the lowest of two versions.
-}
min : Version -> Version -> Version
min v1 v2 =
    if higherThan v1 v2 then
        v1

    else
        v2
