module Version exposing (Version, bumpMajor, bumpMinor, bumpPatch, equals, higherThan, lowerThan, max, min, new, one)


type Version
    = Version
        { major : Int
        , minor : Int
        , patch : Int
        }



-- Constructor


one : Version
one =
    Version { major = 1, minor = 0, patch = 0 }


new : { major : Int, minor : Int, patch : Int } -> Version
new { major, minor, patch } =
    Version
        { major = Basics.max 0 major
        , minor = Basics.max 0 minor
        , patch = Basics.max 0 patch
        }


bumpMajor : Version -> Version
bumpMajor (Version { major, minor, patch }) =
    Version
        { major = major + 1
        , minor = minor
        , patch = patch
        }


bumpMinor : Version -> Version
bumpMinor (Version { major, minor, patch }) =
    Version
        { major = major
        , minor = minor + 1
        , patch = patch
        }


bumpPatch : Version -> Version
bumpPatch (Version { major, minor, patch }) =
    Version
        { major = major
        , minor = minor
        , patch = patch + 1
        }



-- Comparisons


equals : Version -> Version -> Bool
equals (Version v1) (Version v2) =
    (v1.major == v2.major)
        && (v1.minor == v2.minor)
        && (v1.patch == v2.patch)


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


max : Version -> Version -> Version
max v1 v2 =
    if higherThan v1 v2 then
        v2

    else
        v1


min : Version -> Version -> Version
min v1 v2 =
    if higherThan v1 v2 then
        v1

    else
        v2
