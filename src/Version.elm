module Version exposing (Version, bumpMajor, bumpMinor, bumpPatch, fromTuple, higherThan, lowerThan, max, min, new, new_, one, three, toDebugString, toTuple, two, zero)


type Version
    = Version
        { major : Int
        , minor : Int
        , patch : Int
        }



-- Debug


toDebugString : Version -> String
toDebugString (Version { major, minor, patch }) =
    [ major, minor, patch ]
        |> List.map String.fromInt
        |> String.join "."



-- Constructor


zero : Version
zero =
    Version { major = 0, minor = 0, patch = 0 }


one : Version
one =
    Version { major = 1, minor = 0, patch = 0 }


two : Version
two =
    Version { major = 2, minor = 0, patch = 0 }


three : Version
three =
    Version { major = 3, minor = 0, patch = 0 }


new : { major : Int, minor : Int, patch : Int } -> Version
new { major, minor, patch } =
    Version
        { major = Basics.max 0 major
        , minor = Basics.max 0 minor
        , patch = Basics.max 0 patch
        }


new_ : Int -> Int -> Int -> Version
new_ major minor patch =
    new { major = major, minor = minor, patch = patch }


fromTuple : ( Int, Int, Int ) -> Version
fromTuple ( major, minor, patch ) =
    new { major = major, minor = minor, patch = patch }


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


toTuple : Version -> ( Int, Int, Int )
toTuple (Version { major, minor, patch }) =
    ( major, minor, patch )



-- Comparisons


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
