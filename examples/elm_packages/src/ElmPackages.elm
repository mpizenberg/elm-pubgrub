module ElmPackages exposing
    ( allPackages
    , packageVersionFromString
    )

{-| Pre-loaded history of all elm package versions.
NOT USED YET, I'm still in the debugging phase,
with handcrafted examples in Database.Stub.
-}

import Dict exposing (Dict)
import Elm.Version exposing (Version)
import Json.Decode exposing (Decoder)
import Json.Encode


{-| Convert a string of the form: "user/package@version"
into a string package "user/package" and a Version.

Fail with an error message if the string is not valid.

-}
packageVersionFromString : String -> Result String ( String, Version )
packageVersionFromString str =
    case String.split "@" str of
        package :: version :: [] ->
            case Json.Decode.decodeValue Elm.Version.decoder (Json.Encode.string version) of
                Ok elmVersion ->
                    Ok ( package, elmVersion )

                Err err ->
                    Err (Json.Decode.errorToString err)

        _ ->
            Err ("Invalid package and version format: " ++ str)



-- Preloaded history


{-| List of all packages existing the last time the following command was used:

    curl -L https://package.elm-lang.org/all-packages | jq . > history.json

-}
allPackages : Dict String (List Version)
allPackages =
    Json.Decode.decodeString rawHistoryDecoder raw
        |> Result.withDefault Dict.empty


rawHistoryDecoder : Decoder (Dict String (List Version))
rawHistoryDecoder =
    Json.Decode.dict (Json.Decode.list Elm.Version.decoder)


raw : String
raw =
    """
{
  "0ui/elm-task-parallel": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "1602/elm-feather": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "2.3.3",
    "2.3.4",
    "2.3.5"
  ],
  "1602/json-schema": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "1602/json-value": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "1602/json-viewer": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "1hko/elm-truth-table": [
    "1.0.0",
    "2.0.0"
  ],
  "2426021684/elm-collage": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "2426021684/elm-text-width": [
    "1.0.0",
    "1.0.1"
  ],
  "2mol/elm-colormaps": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "7hoenix/elm-chess": [
    "1.0.0"
  ],
  "AaronCZim/to-elm-format-string": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "AdrianRibao/elm-derberos-date": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3"
  ],
  "Apanatshka/elm-list-ndet": [
    "1.0.0",
    "1.0.1"
  ],
  "Apanatshka/elm-signal-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "3.3.1",
    "3.3.2",
    "3.4.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.1.0",
    "5.1.1",
    "5.2.0",
    "5.2.1",
    "5.3.0",
    "5.4.0",
    "5.4.1",
    "5.5.0",
    "5.6.0",
    "5.7.0"
  ],
  "Arkham/elm-chords": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "Arkham/elm-rttl": [
    "1.0.0"
  ],
  "AuricSystemsInternational/creditcard-validator": [
    "1.0.0",
    "1.0.1"
  ],
  "Bastes/the-validator": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "Bernardoow/elm-alert-timer-message": [
    "1.0.0",
    "1.0.1"
  ],
  "Bernardoow/elm-rating-component": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "Bogdanp/elm-ast": [
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "7.0.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.0.3",
    "8.0.4",
    "8.0.5",
    "8.0.6",
    "8.0.7",
    "8.0.8",
    "8.0.9",
    "8.0.10",
    "8.0.11",
    "8.0.12"
  ],
  "Bogdanp/elm-combine": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.1.0",
    "3.1.1"
  ],
  "Bogdanp/elm-datepicker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "Bogdanp/elm-generate": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0"
  ],
  "Bogdanp/elm-querystring": [
    "1.0.0"
  ],
  "Bogdanp/elm-route": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0"
  ],
  "Bogdanp/elm-time": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0"
  ],
  "Bractlet/elm-plot": [
    "1.0.0",
    "1.0.1"
  ],
  "BrianHicks/elm-avl-exploration": [
    "1.0.0"
  ],
  "BrianHicks/elm-benchmark": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "BrianHicks/elm-css-reset": [
    "1.0.0",
    "1.0.1"
  ],
  "BrianHicks/elm-particle": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.3.1"
  ],
  "BrianHicks/elm-string-graphemes": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "BrianHicks/elm-trend": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3"
  ],
  "BuraBure/elm-collision": [
    "1.0.0",
    "1.0.1"
  ],
  "CallumJHays/elm-kalman-filter": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "CallumJHays/elm-sliders": [
    "1.0.0",
    "1.0.1"
  ],
  "CallumJHays/elm-unwrap": [
    "1.0.0"
  ],
  "Cendrb/elm-css": [
    "1.0.0"
  ],
  "Chadtech/ct-colors": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "Chadtech/ctpaint-keys": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "6.0.4",
    "6.0.5",
    "6.0.6",
    "6.0.7",
    "6.0.8",
    "6.0.9"
  ],
  "Chadtech/dependent-text": [
    "1.0.0"
  ],
  "Chadtech/elm-bool-extra": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.4.1",
    "2.4.2"
  ],
  "Chadtech/elm-css-grid": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "Chadtech/elm-imperative-porting": [
    "1.0.0"
  ],
  "Chadtech/elm-loop": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "Chadtech/elm-money": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1"
  ],
  "Chadtech/elm-provider": [
    "1.0.0",
    "2.0.0"
  ],
  "Chadtech/elm-relational-database": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "Chadtech/elm-us-state-abbreviations": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "Chadtech/elm-vector": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "Chadtech/hfnss": [
    "1.0.0",
    "1.0.1"
  ],
  "Chadtech/id": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "4.0.0",
    "4.1.0",
    "4.2.0"
  ],
  "Chadtech/mail": [
    "1.0.0",
    "1.0.1"
  ],
  "Chadtech/order": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "Chadtech/random-pcg-pipeline": [
    "1.0.0"
  ],
  "Chadtech/random-pipeline": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "Chadtech/return": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "Chadtech/tuple-infix": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1"
  ],
  "Chadtech/unique-list": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4"
  ],
  "ChristophP/elm-i18next": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2"
  ],
  "ChristophP/elm-mark": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "CipherDogs/elm-bitcoin": [
    "1.0.0",
    "2.0.0"
  ],
  "CoderDennis/elm-time-format": [
    "1.0.0"
  ],
  "ConcatDK/elm-todoist": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "Confidenceman02/elm-animate-height": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "ContaSystemer/elm-menu": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "CurrySoftware/elm-datepicker": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0"
  ],
  "Dandandan/parser": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.0.4",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "6.2.0",
    "6.2.1",
    "6.2.2",
    "6.2.3",
    "6.2.4",
    "6.2.5"
  ],
  "DavidTobin/elm-key": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "DrBearhands/elm-json-editor": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "EdutainmentLIVE/elm-bootstrap": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "EdutainmentLIVE/elm-dropdown": [
    "1.0.0"
  ],
  "Elm-Canvas/raster-shapes": [
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "EngageSoftware/elm-dnn-http": [
    "1.0.0",
    "2.0.0",
    "2.1.0"
  ],
  "EngageSoftware/elm-dnn-localization": [
    "1.0.2"
  ],
  "EngageSoftware/elm-engage-common": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1"
  ],
  "EngageSoftware/elm-mustache": [
    "1.0.0"
  ],
  "FMFI-UK-1-AIN-412/elm-formula": [
    "1.0.0",
    "2.0.0"
  ],
  "FabienHenon/elm-ckeditor5": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0"
  ],
  "FabienHenon/elm-infinite-list-view": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0"
  ],
  "FabienHenon/elm-infinite-scroll": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "2.4.0",
    "2.4.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "FabienHenon/elm-iso8601-date-strings": [
    "1.0.0"
  ],
  "FabienHenon/elm-pull-to-refresh": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.3.1"
  ],
  "FabienHenon/jsonapi": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "FabienHenon/remote-resource": [
    "1.0.0"
  ],
  "FordLabs/elm-star-rating": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0"
  ],
  "FranklinChen/elm-tau": [
    "1.0.0"
  ],
  "Fresheyeball/deburr": [
    "1.0.0",
    "1.0.1"
  ],
  "Fresheyeball/elm-animate-css": [
    "1.0.0",
    "1.0.1"
  ],
  "Fresheyeball/elm-font-awesome": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "Fresheyeball/elm-function-extra": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0"
  ],
  "Fresheyeball/elm-guards": [
    "1.0.0",
    "1.0.1"
  ],
  "Fresheyeball/elm-nearly-eq": [
    "1.0.0",
    "1.1.0",
    "1.0.1"
  ],
  "Fresheyeball/elm-number-expanded": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "Fresheyeball/elm-restrict-number": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0"
  ],
  "Fresheyeball/elm-return": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "7.0.0",
    "7.1.0"
  ],
  "Fresheyeball/elm-sprite": [
    "1.0.0"
  ],
  "Fresheyeball/elm-tuple-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "3.0.0"
  ],
  "Fresheyeball/elm-yala": [
    "1.0.0",
    "1.1.0"
  ],
  "Fresheyeball/perspective": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "Fresheyeball/sprite": [
    "1.0.0",
    "1.0.1"
  ],
  "Garados007/elm-svg-parser": [
    "1.0.0"
  ],
  "Gizra/elm-all-set": [
    "1.0.0",
    "1.0.1"
  ],
  "Gizra/elm-attribute-builder": [
    "1.0.0",
    "1.0.1"
  ],
  "Gizra/elm-compat-017": [
    "1.0.0"
  ],
  "Gizra/elm-compat-018": [
    "1.0.0"
  ],
  "Gizra/elm-compat-019": [
    "1.0.0",
    "1.1.0"
  ],
  "Gizra/elm-debouncer": [
    "1.0.0",
    "2.0.0"
  ],
  "Gizra/elm-dictlist": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "Gizra/elm-editable-webdata": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "Gizra/elm-essentials": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0"
  ],
  "Gizra/elm-fetch": [
    "1.0.0"
  ],
  "Gizra/elm-keyboard-event": [
    "1.0.0",
    "1.0.1"
  ],
  "Gizra/elm-restful": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "Gizra/elm-storage-key": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "GlobalWebIndex/class-namespaces": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0"
  ],
  "GlobalWebIndex/cmd-extra": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.3.0"
  ],
  "GlobalWebIndex/elm-plural-rules": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "GlobalWebIndex/quantify": [
    "1.0.0"
  ],
  "GlobalWebIndex/segment-elm": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "Guid75/ziplist": [
    "1.0.0",
    "1.0.1"
  ],
  "HAN-ASD-DT/priority-queue": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "HAN-ASD-DT/rsa": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0"
  ],
  "Herteby/enum": [
    "1.0.0",
    "1.0.1"
  ],
  "Herteby/simplex-noise": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "Herteby/url-builder-plus": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "Holmusk/elmoji": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "Holmusk/swagger-decoder": [
    "1.0.0"
  ],
  "HolyMeekrob/elm-font-awesome-5": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0"
  ],
  "InsideSalesOfficial/isdc-elm-ui": [
    "1.0.0"
  ],
  "IzumiSy/elm-consistent-hashing": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1"
  ],
  "IzumiSy/elm-multi-waitable": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "Janiczek/architecture-test": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "Janiczek/browser-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "Janiczek/cmd-extra": [
    "1.0.0",
    "1.1.0"
  ],
  "Janiczek/color-hcl": [
    "1.0.0",
    "2.0.0"
  ],
  "Janiczek/distinct-colors": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "4.0.0",
    "4.0.1"
  ],
  "Janiczek/elm-architecture-test": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9",
    "1.0.10"
  ],
  "Janiczek/elm-bidict": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "Janiczek/elm-encoding": [
    "1.0.0",
    "1.0.1"
  ],
  "Janiczek/elm-graph": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "Janiczek/elm-runescape": [
    "1.0.0",
    "1.0.1"
  ],
  "Janiczek/package-info": [
    "1.0.0"
  ],
  "Janiczek/transform": [
    "1.0.0",
    "1.1.0"
  ],
  "JasonMFry/elm-bootstrap": [
    "1.0.0",
    "1.1.0"
  ],
  "JeremyBellows/elm-bootstrapify": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.1.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "9.0.0",
    "9.0.1"
  ],
  "JoelQ/elm-dollar": [
    "1.0.0"
  ],
  "JoelQ/elm-toggleable": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "JoeyEremondi/array-multidim": [
    "1.0.0"
  ],
  "JoeyEremondi/elm-typenats": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "JoeyEremondi/safelist": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "JoeyEremondi/typenats": [
    "1.0.0"
  ],
  "JohnBugner/elm-bag": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "JohnBugner/elm-loop": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0"
  ],
  "JohnBugner/elm-matrix": [
    "1.0.0"
  ],
  "JonRowe/elm-jwt": [
    "1.0.0"
  ],
  "JordyMoos/elm-clockpicker": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "JordyMoos/elm-pageloader": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "JordyMoos/elm-quiz": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "JoshuaHall/elm-fraction": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0"
  ],
  "JulianKniephoff/elm-time-extra": [
    "1.0.0"
  ],
  "JustinLove/elm-twitch-api": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.2.0",
    "4.3.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0"
  ],
  "JustusAdam/elm-path": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "1.2.4",
    "1.3.0"
  ],
  "K-Adam/elm-dom": [
    "1.0.0"
  ],
  "Kinto/elm-kinto": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "7.0.0",
    "8.0.0"
  ],
  "Kraxorax/elm-matrix-a": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "KtorZ/elm-notification": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "Kurren123/k-dropdown-container": [
    "1.0.0"
  ],
  "Kwarrtz/render": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "Leonti/elm-material-datepicker": [
    "1.0.0"
  ],
  "Leonti/elm-time-picker": [
    "1.0.0",
    "2.0.0"
  ],
  "LesleyLai/elm-grid": [
    "1.0.0",
    "1.0.1"
  ],
  "Libbum/elm-partition": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "Libbum/elm-redblacktrees": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "Logiraptor/elm-bench": [
    "1.0.0",
    "1.1.0"
  ],
  "M1chaelTran/elm-graphql": [
    "1.0.0"
  ],
  "MacCASOutreach/graphicsvg": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "7.0.0",
    "7.0.1",
    "7.1.0"
  ],
  "MadonnaMat/elm-select-two": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1"
  ],
  "MartinKavik/elm-combinatorics": [
    "1.0.0",
    "1.0.1"
  ],
  "MartinSStewart/elm-audio": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "MartinSStewart/elm-bayer-matrix": [
    "1.0.0"
  ],
  "MartinSStewart/elm-box-packing": [
    "1.0.0",
    "1.0.1"
  ],
  "MartinSStewart/elm-codec-bytes": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "MartinSStewart/elm-nonempty-string": [
    "1.0.0",
    "1.0.1"
  ],
  "MartinSStewart/send-grid": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "MattCheely/tryframe-coordinator": [
    "1.0.0",
    "2.0.0"
  ],
  "MatthewJohnHeath/elm-fingertree": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "MaybeJustJames/yaml": [
    "1.0.0"
  ],
  "MazeChaZer/elm-ckeditor": [
    "1.0.0"
  ],
  "MichaelCombs28/elm-base85": [
    "1.0.0",
    "1.0.1"
  ],
  "MichaelCombs28/elm-css-bulma": [
    "1.0.0"
  ],
  "MichaelCombs28/elm-dom": [
    "1.0.0"
  ],
  "MichaelCombs28/elm-mdl": [
    "1.0.0",
    "1.0.1"
  ],
  "MichaelCombs28/elm-parts": [
    "1.0.0"
  ],
  "MichaelCombs28/unit-list": [
    "1.0.0"
  ],
  "Microsoft/elm-json-tree-view": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "MikaelMayer/parser": [
    "1.0.0",
    "1.1.0"
  ],
  "Morgan-Stanley/morphir-elm": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0"
  ],
  "Natim/elm-workalendar": [
    "1.0.0",
    "1.0.1"
  ],
  "Nexosis/nexosisclient-elm": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.1.1"
  ],
  "NoRedInk/datetimepicker": [
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "2.0.4",
    "3.0.2"
  ],
  "NoRedInk/datetimepicker-legacy": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "NoRedInk/elm-api-components": [
    "1.0.0",
    "2.0.0"
  ],
  "NoRedInk/elm-check": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "NoRedInk/elm-compare": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "NoRedInk/elm-debug-controls-without-datepicker": [
    "1.0.0",
    "1.0.1"
  ],
  "NoRedInk/elm-decode-pipeline": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "NoRedInk/elm-doodad": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.4.1",
    "2.5.0",
    "2.5.1",
    "2.6.0",
    "2.7.0",
    "2.7.1",
    "2.8.0",
    "2.8.1",
    "2.9.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "5.0.0",
    "5.0.1"
  ],
  "NoRedInk/elm-feature-interest": [
    "1.0.0",
    "1.0.1"
  ],
  "NoRedInk/elm-formatted-text": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "2.3.3",
    "2.3.4"
  ],
  "NoRedInk/elm-formatted-text-19": [
    "1.0.0"
  ],
  "NoRedInk/elm-formatted-text-test-helpers": [
    "1.0.0",
    "1.0.1"
  ],
  "NoRedInk/elm-json-decode-pipeline": [
    "1.0.0"
  ],
  "NoRedInk/elm-lazy-list": [
    "1.0.0",
    "2.0.0"
  ],
  "NoRedInk/elm-phoenix": [
    "1.0.0"
  ],
  "NoRedInk/elm-plot-19": [
    "1.0.0"
  ],
  "NoRedInk/elm-plot-rouge": [
    "1.0.0"
  ],
  "NoRedInk/elm-rails": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "4.0.6",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.1.0",
    "6.2.0",
    "7.0.0",
    "8.0.0",
    "9.0.0"
  ],
  "NoRedInk/elm-random-extra": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "NoRedInk/elm-random-general": [
    "1.0.0"
  ],
  "NoRedInk/elm-random-pcg-extended": [
    "1.0.0"
  ],
  "NoRedInk/elm-rfc5988-parser": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "NoRedInk/elm-rollbar": [
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "NoRedInk/elm-saved": [
    "1.0.0",
    "1.0.1"
  ],
  "NoRedInk/elm-shrink": [
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "NoRedInk/elm-simple-fuzzy": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "NoRedInk/elm-sortable-table": [
    "1.0.0"
  ],
  "NoRedInk/elm-string-conversions": [
    "1.0.0",
    "1.0.1"
  ],
  "NoRedInk/elm-string-extra": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.3.1"
  ],
  "NoRedInk/elm-sweet-poll": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0"
  ],
  "NoRedInk/elm-task-extra": [
    "1.0.1",
    "2.0.0"
  ],
  "NoRedInk/elm-uuid": [
    "1.0.0",
    "2.0.0"
  ],
  "NoRedInk/elm-view-utils": [
    "1.1.0",
    "1.1.1",
    "1.0.0"
  ],
  "NoRedInk/http-upgrade-shim": [
    "1.0.0"
  ],
  "NoRedInk/json-elm-schema": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0"
  ],
  "NoRedInk/list-selection": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1"
  ],
  "NoRedInk/noredink-ui": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "3.4.0",
    "3.5.0",
    "3.5.1",
    "3.6.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "4.4.0",
    "4.5.0",
    "4.6.0",
    "4.7.0",
    "4.8.0",
    "4.9.0",
    "4.9.1",
    "4.10.0",
    "4.11.0",
    "4.11.1",
    "4.12.0",
    "4.13.0",
    "4.14.0",
    "4.15.0",
    "5.0.0",
    "5.1.0",
    "5.2.0",
    "5.3.0",
    "5.4.0",
    "5.5.0",
    "5.5.1",
    "5.5.2",
    "5.5.3",
    "5.6.0",
    "5.7.0",
    "5.8.0",
    "5.8.1",
    "5.8.2",
    "5.9.0",
    "5.9.1",
    "5.10.0",
    "5.11.0",
    "6.0.0",
    "6.1.0",
    "6.1.1",
    "6.1.2",
    "6.1.3",
    "6.1.4",
    "6.1.5",
    "6.1.6",
    "6.2.0",
    "6.3.0",
    "6.4.0",
    "6.5.0",
    "6.6.0",
    "6.6.1",
    "6.6.2",
    "6.6.3",
    "6.7.0",
    "6.8.0",
    "6.8.1",
    "6.9.0",
    "6.10.0",
    "6.11.0",
    "6.11.1",
    "6.12.0",
    "6.13.0",
    "6.13.1",
    "6.14.0",
    "6.15.0",
    "6.16.0",
    "6.17.0",
    "6.18.0",
    "6.19.0",
    "6.19.1",
    "6.20.0",
    "6.20.1",
    "6.21.0",
    "6.22.0",
    "6.23.0",
    "6.23.1",
    "6.23.2",
    "6.24.0",
    "6.24.1",
    "6.25.0",
    "6.26.0",
    "6.26.1",
    "6.27.0",
    "6.28.0",
    "6.29.0",
    "6.29.1",
    "6.30.0",
    "6.31.0",
    "7.0.0",
    "7.1.0",
    "7.1.1",
    "7.1.2",
    "7.1.3",
    "7.1.4",
    "7.2.0",
    "7.2.1",
    "7.3.0",
    "7.4.0",
    "7.4.1",
    "7.5.0",
    "7.6.0",
    "7.7.0",
    "7.8.0",
    "7.9.0",
    "7.10.0",
    "7.11.0",
    "7.12.0",
    "7.12.1",
    "7.13.0",
    "7.14.0",
    "7.14.1",
    "7.14.2",
    "7.15.0",
    "7.16.0",
    "7.17.0",
    "7.17.1",
    "7.18.0",
    "7.18.1",
    "7.19.0",
    "7.20.0",
    "7.21.0",
    "7.22.0",
    "7.23.0",
    "7.24.0",
    "7.25.0",
    "7.25.1",
    "7.26.0",
    "7.26.1",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "8.3.0",
    "8.3.1",
    "9.0.0",
    "9.1.0",
    "9.2.0",
    "9.3.0",
    "9.4.0",
    "9.5.0",
    "9.5.1",
    "9.0.1",
    "9.6.0",
    "9.5.2",
    "9.0.2",
    "9.7.0",
    "9.8.0",
    "9.8.1",
    "9.9.0",
    "10.0.0",
    "10.1.0",
    "10.2.0",
    "10.3.0",
    "10.4.0"
  ],
  "NoRedInk/nri-elm-css": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.5.0",
    "1.5.1",
    "1.6.0",
    "1.6.1",
    "1.7.0",
    "1.7.1",
    "1.8.0",
    "1.9.0",
    "1.9.1",
    "1.10.0",
    "1.11.0",
    "1.12.0",
    "1.12.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1"
  ],
  "NoRedInk/rocket-update": [
    "1.0.0"
  ],
  "NoRedInk/start-app": [
    "1.0.0",
    "2.0.0"
  ],
  "NoRedInk/style-elements": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "NoRedInk/view-extra": [
    "2.0.0"
  ],
  "OldhamMade/elm-charts": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "Orange-OpenSource/elm-advanced-grid": [
    "1.0.0",
    "1.0.1"
  ],
  "Orasund/elm-action": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "Orasund/elm-cellautomata": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "Orasund/elm-game-essentials": [
    "1.0.0",
    "1.1.0"
  ],
  "Orasund/elm-jsonstore": [
    "1.0.0",
    "2.0.0"
  ],
  "Orasund/elm-pair": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "Orasund/elm-ui-framework": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.6.1"
  ],
  "Orasund/elm-ui-widgets": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "Orasund/pixelengine": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.2.3",
    "2.2.4",
    "2.2.5",
    "2.2.6",
    "2.2.7",
    "2.2.8",
    "2.2.9",
    "2.2.10",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "6.0.0",
    "6.1.0",
    "6.2.0"
  ],
  "PaackEng/elm-alert-beta": [
    "1.0.0"
  ],
  "PaackEng/elm-google-maps": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "PaackEng/elm-svg-string": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "PaackEng/elm-ui-dialog": [
    "1.0.0"
  ],
  "PaackEng/elm-ui-dropdown": [
    "1.0.0",
    "1.1.0"
  ],
  "PaackEng/paack-ui": [
    "1.0.0"
  ],
  "PanagiotisGeorgiadis/elm-datepicker": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.2.1"
  ],
  "PanagiotisGeorgiadis/elm-datetime": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0"
  ],
  "Pilatch/elm-simple-port-program": [
    "1.0.0",
    "1.0.1"
  ],
  "Punie/elm-id": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "Punie/elm-matrix": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "Punie/elm-parser-extras": [
    "1.0.0"
  ],
  "Punie/elm-reader": [
    "1.0.0"
  ],
  "QiTASC/hatchinq": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.2.0",
    "4.2.1",
    "4.3.0",
    "4.4.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.1.0",
    "9.0.0",
    "9.1.0",
    "9.2.0",
    "9.3.0",
    "10.0.0",
    "10.0.1",
    "10.1.0",
    "11.0.0",
    "11.0.1",
    "11.0.2",
    "11.1.0",
    "11.2.0",
    "12.0.0",
    "13.0.0",
    "14.0.0",
    "14.1.0",
    "14.2.0",
    "15.0.0",
    "15.0.1",
    "16.0.0",
    "17.0.0",
    "17.0.1",
    "17.0.2",
    "18.0.0",
    "18.0.1",
    "19.0.0",
    "19.0.1",
    "20.0.0",
    "21.0.0",
    "21.0.1",
    "22.0.0",
    "22.0.1",
    "23.0.0",
    "24.0.0",
    "25.0.0",
    "25.0.1",
    "25.1.0",
    "25.2.0",
    "25.2.1",
    "26.0.0",
    "27.0.0"
  ],
  "RGBboy/websocket-server": [
    "1.0.0",
    "1.0.1"
  ],
  "RalfNorthman/elm-zoom-plot": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "RobbieMcKinstry/stripe": [
    "1.0.0"
  ],
  "RomanErnst/erl": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "RoyalIcing/datadown-elm": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "RoyalIcing/inflexio": [
    "1.0.0"
  ],
  "RoyalIcing/lofi-elm": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "RoyalIcing/lofi-schema-elm": [
    "1.0.0"
  ],
  "SHyx0rmZ/selectable-list": [
    "1.0.0"
  ],
  "STTR13/ziplist": [
    "1.0.0"
  ],
  "SamirTalwar/arborist": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "Saulzar/elm-keyboard-keys": [
    "1.0.0"
  ],
  "Saulzar/key-constants": [
    "1.0.0"
  ],
  "SelectricSimian/elm-constructive": [
    "1.0.0"
  ],
  "Shearerbeard/stripe": [
    "1.0.1",
    "2.0.0"
  ],
  "SidneyNemzer/elm-remote-data": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "SimplyNaOH/elm-searchable-menu": [
    "1.0.0"
  ],
  "SiriusStarr/elm-password-strength": [
    "1.0.0",
    "1.0.1"
  ],
  "SiriusStarr/elm-spaced-repetition": [
    "1.0.0",
    "1.1.0"
  ],
  "SiriusStarr/elm-splat": [
    "1.0.0"
  ],
  "Skinney/collections-ng": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "Skinney/elm-array-exploration": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5"
  ],
  "Skinney/elm-deque": [
    "1.0.0",
    "1.1.0"
  ],
  "Skinney/elm-dict-exploration": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "Skinney/elm-phone-numbers": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "2.0.7",
    "2.0.8",
    "2.0.9",
    "2.0.10",
    "2.0.11",
    "2.0.12",
    "2.0.13",
    "2.0.14",
    "2.0.15",
    "2.0.16",
    "2.0.17",
    "2.0.18",
    "2.0.19",
    "2.0.20",
    "2.0.21",
    "2.0.22",
    "2.0.23",
    "2.0.24",
    "2.0.25",
    "2.0.26",
    "2.0.27",
    "2.0.28"
  ],
  "Skinney/elm-warrior": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5"
  ],
  "Skinney/fnv": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "Skinney/keyboard-events": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "Skinney/murmur3": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "2.0.7",
    "2.0.8"
  ],
  "Spaxe/elm-lsystem": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1"
  ],
  "Spaxe/svg-pathd": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "StoatPower/elm-wkt": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "SwiftsNamesake/euclidean-space": [
    "1.0.0",
    "2.0.0"
  ],
  "SwiftsNamesake/please-focus": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "SwiftsNamesake/proper-keyboard": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0"
  ],
  "SylvanSign/elm-pointer-events": [
    "1.0.2"
  ],
  "TSFoster/elm-bytes-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0"
  ],
  "TSFoster/elm-compare": [
    "1.0.0",
    "1.0.1"
  ],
  "TSFoster/elm-envfile": [
    "1.0.0",
    "1.0.1"
  ],
  "TSFoster/elm-heap": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "TSFoster/elm-md5": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "TSFoster/elm-sha1": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "TSFoster/elm-tuple-extra": [
    "1.0.0",
    "2.0.0"
  ],
  "TSFoster/elm-uuid": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0",
    "4.0.1"
  ],
  "TheDahv/doctari": [
    "1.0.0"
  ],
  "TheSeamau5/elm-check": [
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.2.0"
  ],
  "TheSeamau5/elm-html-decoder": [
    "1.0.0",
    "1.0.1"
  ],
  "TheSeamau5/elm-lazy-list": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "TheSeamau5/elm-material-icons": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "TheSeamau5/elm-quadtree": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "TheSeamau5/elm-random-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0"
  ],
  "TheSeamau5/elm-router": [
    "1.0.0"
  ],
  "TheSeamau5/elm-shrink": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.0.1"
  ],
  "TheSeamau5/elm-spring": [
    "1.0.0"
  ],
  "TheSeamau5/elm-task-extra": [
    "1.0.0",
    "2.0.0"
  ],
  "TheSeamau5/elm-undo-redo": [
    "1.0.0",
    "2.0.0"
  ],
  "TheSeamau5/flex-html": [
    "2.0.0",
    "2.0.1"
  ],
  "TheSeamau5/selection-list": [
    "1.0.0"
  ],
  "TheSeamau5/typographic-scale": [
    "1.0.0"
  ],
  "ThinkAlexandria/css-in-elm": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "ThinkAlexandria/elm-drag-locations": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "ThinkAlexandria/elm-html-in-elm": [
    "1.0.0",
    "1.0.1"
  ],
  "ThinkAlexandria/elm-pretty-print-json": [
    "1.0.0",
    "1.0.1"
  ],
  "ThinkAlexandria/elm-primer-tooltips": [
    "1.0.0",
    "2.0.0",
    "2.1.0"
  ],
  "ThinkAlexandria/keyboard-extra": [
    "1.0.0",
    "1.0.1"
  ],
  "ThinkAlexandria/window-manager": [
    "1.0.0"
  ],
  "ThomasWeiser/elmfire": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7"
  ],
  "ThomasWeiser/elmfire-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "TimothyDespair/elm-maybe-applicator": [
    "1.0.0"
  ],
  "VerbalExpressions/elm-verbal-expressions": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "2.0.0"
  ],
  "Voronchuk/hexagons": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0"
  ],
  "Warry/elmi-decoder": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "WhileTruu/elm-blurhash": [
    "1.0.0"
  ],
  "WhileTruu/elm-smooth-scroll": [
    "1.0.0",
    "1.0.1"
  ],
  "YuyaAizawa/list-wrapper": [
    "1.0.0",
    "1.0.1"
  ],
  "YuyaAizawa/peg": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0"
  ],
  "Zaptic/elm-glob": [
    "1.0.0",
    "1.0.1"
  ],
  "Zinggi/elm-2d-game": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "Zinggi/elm-game-resources": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "Zinggi/elm-glsl-generator": [
    "1.0.0"
  ],
  "Zinggi/elm-hash-icon": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "Zinggi/elm-obj-loader": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "Zinggi/elm-random-general": [
    "1.0.0",
    "1.0.1"
  ],
  "Zinggi/elm-random-pcg-extended": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "Zinggi/elm-uuid": [
    "1.0.0"
  ],
  "Zinggi/elm-webgl-math": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "aardito2/realm": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "abadi199/dateparser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "abadi199/datetimepicker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "6.0.1"
  ],
  "abadi199/datetimepicker-css": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "abadi199/elm-creditcard": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.0.1",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "10.0.0",
    "10.0.1"
  ],
  "abadi199/elm-input-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.1.1",
    "4.2.0",
    "4.2.1",
    "4.2.2",
    "4.3.0",
    "5.0.0",
    "5.1.0",
    "5.2.0",
    "5.2.1",
    "5.2.2",
    "5.2.3",
    "5.2.4"
  ],
  "abadi199/intl-phone-input": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "abinayasudhir/elm-select": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0"
  ],
  "abinayasudhir/elm-treeview": [
    "1.0.0",
    "1.0.1"
  ],
  "abinayasudhir/html-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "abinayasudhir/outmessage": [
    "1.0.0"
  ],
  "abradley2/elm-calendar": [
    "1.0.0"
  ],
  "abradley2/elm-datepicker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "abradley2/elm-form-controls": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2"
  ],
  "abradley2/form-controls": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "abradley2/form-elements": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2"
  ],
  "abradley2/form-fields": [
    "1.0.0"
  ],
  "abrykajlo/elm-scroll": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "achutkiran/elm-material-color": [
    "1.0.0",
    "1.0.1"
  ],
  "achutkiran/material-components-elm": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.2.1"
  ],
  "adauguet/elm-spanned-string": [
    "1.0.0",
    "1.0.1"
  ],
  "adeschamps/mdl-context": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "adius/vectual": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "afidegnum/elm-bulmanizer": [
    "1.0.0"
  ],
  "afidegnum/elm-tailwind": [
    "1.0.0"
  ],
  "aforemny/material-components-web-elm": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0"
  ],
  "agrafix/elm-bootforms": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "10.0.0"
  ],
  "agustinrhcp/elm-datepicker": [
    "1.0.0"
  ],
  "agustinrhcp/elm-mask": [
    "1.0.0"
  ],
  "ahstro/elm-bulma-classes": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "ahstro/elm-konami-code": [
    "1.0.0"
  ],
  "ahstro/elm-luhn": [
    "1.0.0",
    "1.0.1"
  ],
  "ahstro/elm-ssn-validation": [
    "1.0.0",
    "1.1.0"
  ],
  "akavel/elm-expo": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "akbiggs/elm-effects": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "akbiggs/elm-game-update": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "akheron/elm-easter": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "akoppela/elm-autocomplete": [
    "1.0.0",
    "1.0.1"
  ],
  "akoppela/elm-logo": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "alech/elm-calendarweeks": [
    "1.0.0"
  ],
  "alepop/elm-google-url-shortener": [
    "1.0.0"
  ],
  "alex-tan/elm-dialog": [
    "1.0.0"
  ],
  "alex-tan/elm-tree-diagram": [
    "1.0.0"
  ],
  "alex-tan/loadable": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.1.2"
  ],
  "alex-tan/postgrest-client": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "alex-tan/postgrest-queries": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.1.0",
    "7.2.0"
  ],
  "alex-tan/task-extra": [
    "1.0.0",
    "1.1.0"
  ],
  "alexanderkiel/elm-mdc-alpha": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0"
  ],
  "alexanderkiel/list-selection": [
    "1.0.0"
  ],
  "alexandrepiveteau/elm-algebraic-graph": [
    "1.0.0"
  ],
  "alexandrepiveteau/elm-ordt": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "alexkorban/uicards": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "alinz/elm-vector2d": [
    "1.0.0"
  ],
  "allenap/elm-json-decode-broken": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "allo-media/canopy": [
    "1.0.0"
  ],
  "allo-media/elm-daterange-picker": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2"
  ],
  "allo-media/elm-es-simple-query-string": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "allo-media/fable": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "allo-media/koivu": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "alltonp/elm-driveby": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "alpacaaa/elm-date-distance": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0"
  ],
  "altjsus/elm-airtable": [
    "1.0.0"
  ],
  "altjsus/elmtable": [
    "1.0.0"
  ],
  "aluuu/elm-check-io": [
    "1.0.0"
  ],
  "alvivi/elm-css-aria": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "2.0.0"
  ],
  "alvivi/elm-keyword-list": [
    "1.0.0",
    "1.0.1"
  ],
  "alvivi/elm-nested-list": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "alvivi/elm-widgets": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "3.4.0",
    "3.4.1"
  ],
  "amaksimov/elm-maybe-pipeline": [
    "1.0.0"
  ],
  "amaksimov/elm-multikey-handling": [
    "1.0.0"
  ],
  "amazzeo/elm-math-strings": [
    "1.0.0",
    "1.0.1"
  ],
  "ambuc/juggling-graph": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "amilner42/keyboard-extra": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "amitu/elm-formatting": [
    "1.0.0"
  ],
  "anatol-1988/measurement": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "andre-dietrich/elm-mapbox": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "andre-dietrich/elm-random-pcg-regex": [
    "1.0.1",
    "1.0.0"
  ],
  "andre-dietrich/elm-random-regex": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9"
  ],
  "andre-dietrich/elm-svgbob": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0"
  ],
  "andre-dietrich/parser-combinators": [
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "4.0.0"
  ],
  "andrewMacmurray/elm-delay": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0"
  ],
  "andrewjackman/toasty-bootstrap": [
    "1.0.0",
    "2.0.0"
  ],
  "andys8/elm-geohash": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "anhmiuhv/pannablevideo": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "annaghi/dnd-list": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "6.0.0",
    "6.0.1"
  ],
  "antivanov/eunit": [
    "1.0.0"
  ],
  "aphorisme/elm-oprocesso": [
    "1.0.0",
    "1.1.0"
  ],
  "apuchenkin/elm-multiway-tree-extra": [
    "1.0.0"
  ],
  "apuchenkin/elm-nested-router": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0"
  ],
  "aramiscd/elm-basscss": [
    "1.0.0",
    "1.0.1"
  ],
  "aristidesstaffieri/elm-poisson": [
    "1.0.0"
  ],
  "arnau/elm-feather": [
    "1.0.0"
  ],
  "arnau/elm-objecthash": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1"
  ],
  "arowM/elm-chat-scenario": [
    "1.0.0",
    "1.1.0"
  ],
  "arowM/elm-check-button": [
    "1.0.0"
  ],
  "arowM/elm-classname": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/elm-css-modules-helper": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/elm-data-url": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0"
  ],
  "arowM/elm-default": [
    "1.0.0"
  ],
  "arowM/elm-embedded-gist": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "arowM/elm-evil-sendmsg": [
    "1.0.0"
  ],
  "arowM/elm-form-decoder": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0"
  ],
  "arowM/elm-form-validator": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "arowM/elm-html-extra-internal": [
    "1.0.0",
    "1.1.0"
  ],
  "arowM/elm-html-internal": [
    "1.0.0"
  ],
  "arowM/elm-html-with-context": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/elm-istring": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "arowM/elm-mixin": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "arowM/elm-monoid": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "arowM/elm-neat-layout": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "arowM/elm-parser-test": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0"
  ],
  "arowM/elm-raw-html": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/elm-reference": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7"
  ],
  "arowM/elm-show": [
    "1.0.0"
  ],
  "arowM/elm-time-machine": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/html": [
    "1.0.0",
    "1.0.1"
  ],
  "arowM/html-extra": [
    "1.0.0"
  ],
  "arsduo/elm-dom-drag-drop": [
    "1.0.0"
  ],
  "arsduo/elm-ui-drag-drop": [
    "1.0.0",
    "2.0.0"
  ],
  "arturopala/elm-monocle": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.3.1",
    "1.3.2",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.6.0",
    "1.7.0",
    "2.0.0",
    "2.1.0",
    "2.2.0"
  ],
  "ashelab/elm-cqrs": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "astynax/tea-combine": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "athanclark/elm-debouncer": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1"
  ],
  "athanclark/elm-discrete-transition": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1"
  ],
  "athanclark/elm-duration": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "4.0.1",
    "5.0.1"
  ],
  "athanclark/elm-every": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.0.1"
  ],
  "athanclark/elm-param-parsing-2": [
    "1.0.0"
  ],
  "athanclark/elm-threading": [
    "1.0.0",
    "2.0.0"
  ],
  "austinshenk/elm-w3": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "avh4/burndown-charts": [
    "1.0.0"
  ],
  "avh4/elm-beautiful-example": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1"
  ],
  "avh4/elm-color": [
    "1.0.0"
  ],
  "avh4/elm-debug-controls": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1"
  ],
  "avh4/elm-desktop-app": [
    "1.0.0"
  ],
  "avh4/elm-diff": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7"
  ],
  "avh4/elm-dropbox": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "3.0.0"
  ],
  "avh4/elm-favicon": [
    "1.0.0"
  ],
  "avh4/elm-fifo": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "avh4/elm-github-v3": [
    "1.0.0"
  ],
  "avh4/elm-meshes": [
    "1.0.0",
    "1.0.1"
  ],
  "avh4/elm-program-test": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0"
  ],
  "avh4/elm-spec": [
    "1.0.0",
    "2.0.0"
  ],
  "avh4/elm-table": [
    "1.0.0"
  ],
  "avh4/elm-testable": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "avh4/elm-transducers": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1"
  ],
  "avh4/elm-typed-styles": [
    "1.0.0",
    "2.0.0"
  ],
  "avh4-experimental/elm-debug-controls-without-datepicker": [
    "1.0.0",
    "1.0.1"
  ],
  "avh4-experimental/elm-layout": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.1.0"
  ],
  "avh4-experimental/elm-transducers": [
    "1.0.0"
  ],
  "azer/elm-ui-styles": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0"
  ],
  "b0oh/elm-do": [
    "1.0.0"
  ],
  "b52/elm-semantic-ui": [
    "1.1.0"
  ],
  "bChiquet/elm-accessors": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "bChiquet/line-charts": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "babsballetschool/image-directory": [
    "1.0.0"
  ],
  "bakkemo/elm-collision": [
    "1.0.0",
    "2.0.1",
    "2.0.0",
    "2.0.2"
  ],
  "bardt/elm-rosetree": [
    "1.0.0",
    "1.0.1"
  ],
  "bartavelle/json-helpers": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "base-dev/elm-graphql-module": [
    "1.0.0"
  ],
  "basti1302/elm-human-readable-filesize": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.2.0"
  ],
  "basti1302/elm-non-empty-array": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "2.0.0",
    "2.1.0"
  ],
  "bburdette/cellme": [
    "1.0.0"
  ],
  "bburdette/pdf-element": [
    "1.0.0",
    "1.0.1"
  ],
  "bburdette/schelme": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "bburdette/stl": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "bburdette/toop": [
    "1.0.0",
    "1.0.1"
  ],
  "bburdette/typed-collections": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "bburdette/websocket": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "bcardiff/elm-debounce": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "bcardiff/elm-infscroll": [
    "1.0.0"
  ],
  "bemyak/elm-slider": [
    "1.0.0"
  ],
  "benansell/elm-geometric-transformation": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "benansell/lobo-elm-test-extra": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0"
  ],
  "bendyworks/elm-action-cable": [
    "1.0.0"
  ],
  "benthepoet/elm-purecss": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "bernerbrau/elm-css-widgets": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "besuikerd/elm-dictset": [
    "1.0.0",
    "1.0.1"
  ],
  "bgrosse-midokura/composable-form": [
    "1.0.0"
  ],
  "bigardone/elm-css-placeholders": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "bigbinary/elm-form-field": [
    "1.0.0",
    "1.1.0"
  ],
  "bigbinary/elm-reader": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "billperegoy/elm-form-validations": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "billperegoy/elm-sifter": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "billstclair/elm-bitwise-infix": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "billstclair/elm-chat": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "billstclair/elm-crypto-aes": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9",
    "1.0.10"
  ],
  "billstclair/elm-crypto-string": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "3.0.0",
    "3.0.1"
  ],
  "billstclair/elm-custom-element": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.4.0"
  ],
  "billstclair/elm-dev-random": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.1.0"
  ],
  "billstclair/elm-dialog": [
    "1.0.0",
    "1.0.1"
  ],
  "billstclair/elm-digital-ocean": [
    "1.0.0"
  ],
  "billstclair/elm-dynamodb": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "billstclair/elm-geolocation": [
    "1.0.0",
    "1.1.0"
  ],
  "billstclair/elm-html-template": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "3.1.1"
  ],
  "billstclair/elm-id-search": [
    "1.0.0",
    "1.0.1"
  ],
  "billstclair/elm-localstorage": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "7.0.0",
    "7.1.0",
    "7.2.0"
  ],
  "billstclair/elm-mastodon": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "9.0.2"
  ],
  "billstclair/elm-mastodon-websocket": [
    "1.0.0"
  ],
  "billstclair/elm-oauth-middleware": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "billstclair/elm-popup-picker": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "billstclair/elm-port-funnel": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.2.0"
  ],
  "billstclair/elm-recovered": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "billstclair/elm-recovered-utf8": [
    "1.0.0"
  ],
  "billstclair/elm-s3": [
    "1.0.0"
  ],
  "billstclair/elm-sha256": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9"
  ],
  "billstclair/elm-simple-xml-to-json": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "billstclair/elm-sortable-table": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.2.0"
  ],
  "billstclair/elm-svg-button": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "billstclair/elm-system-notification": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "billstclair/elm-versioned-json": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "billstclair/elm-websocket-client": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.1.0"
  ],
  "billstclair/elm-websocket-framework": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.1.0",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "11.0.1",
    "11.0.2",
    "12.0.0",
    "13.0.0",
    "13.0.1",
    "13.0.2"
  ],
  "billstclair/elm-websocket-framework-server": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.1.0",
    "6.1.1",
    "6.1.2",
    "7.0.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.0.3",
    "9.0.0",
    "9.1.0",
    "10.0.0",
    "10.0.1",
    "11.0.0",
    "12.0.0",
    "13.0.0",
    "14.0.0",
    "14.0.1",
    "14.1.0",
    "14.1.1",
    "14.1.2",
    "14.1.3"
  ],
  "billstclair/elm-xml-eeue56": [
    "1.0.0",
    "1.0.1"
  ],
  "billstclair/elm-xml-extra": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0"
  ],
  "bitrage-io/elm-ratequeue": [
    "1.0.0"
  ],
  "bkuhlmann/form-validator": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "blacksheepmails/elm-set": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "blissfully/elm-chartjs-webcomponent": [
    "1.0.0",
    "2.0.0"
  ],
  "bloom/aviators": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.1.0"
  ],
  "bloom/elm-return": [
    "1.0.0",
    "1.0.1"
  ],
  "bloom/remotedata": [
    "1.0.1"
  ],
  "blue-dinosaur/lambda": [
    "1.0.0",
    "1.0.1"
  ],
  "bluedogtraining/bdt-elm": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.2.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "6.2.0",
    "7.0.0",
    "7.1.0",
    "8.0.0",
    "8.1.0",
    "8.1.1",
    "8.2.0",
    "8.3.0",
    "9.0.0",
    "9.0.1",
    "10.0.0",
    "11.0.0",
    "12.0.0",
    "12.0.1",
    "13.0.0",
    "13.1.0",
    "13.1.1",
    "13.1.2",
    "14.0.0",
    "15.0.0",
    "15.1.0",
    "15.1.1",
    "15.1.2",
    "15.1.3",
    "16.0.0",
    "16.1.0",
    "17.0.0",
    "17.1.0",
    "18.0.0",
    "18.1.0",
    "18.1.1",
    "19.0.0",
    "19.0.1",
    "20.0.0",
    "21.0.0",
    "21.0.1",
    "21.0.2",
    "21.1.0",
    "22.0.0",
    "22.0.1",
    "22.1.0",
    "23.0.0",
    "24.0.0",
    "25.0.0",
    "25.1.0",
    "26.0.0",
    "26.0.1",
    "26.1.0",
    "26.1.1",
    "26.1.2",
    "26.1.3",
    "26.1.4",
    "26.1.5",
    "26.1.6",
    "27.0.0",
    "27.0.1",
    "27.0.2",
    "27.0.3",
    "27.0.4",
    "27.0.5",
    "27.0.6",
    "27.0.7",
    "27.0.8",
    "27.0.9",
    "27.0.10",
    "27.0.11",
    "27.0.12",
    "27.0.13"
  ],
  "boianr/multilingual": [
    "1.0.0"
  ],
  "bowbahdoe/elm-history": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "bowbahdoe/lime-reset": [
    "1.0.0"
  ],
  "brainrape/elm-ast": [
    "1.0.0",
    "1.0.1"
  ],
  "brainrape/elm-bidict": [
    "1.0.0"
  ],
  "brainrape/flex-html": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "brandly/elm-dot-lang": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4"
  ],
  "brasilikum/is-password-known": [
    "1.0.0"
  ],
  "brenden/elm-tree-diagram": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "brian-watkins/elm-procedure": [
    "1.0.0"
  ],
  "brian-watkins/elm-spec": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.0.1"
  ],
  "brianvanburken/elm-list-date": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "brightdb/sequence": [
    "1.0.0",
    "1.1.0"
  ],
  "bruz/elm-simple-form-infix": [
    "1.0.1",
    "1.0.0"
  ],
  "bundsol/boxed": [
    "1.0.0",
    "2.0.0"
  ],
  "burabure/elm-collision": [
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "burnable-tech/elm-ethereum": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "bzimmermandev/autogrid": [
    "1.0.0"
  ],
  "cacay/elm-void": [
    "1.0.0"
  ],
  "cakenggt/elm-net": [
    "1.0.0"
  ],
  "calions-app/app-object": [
    "1.0.0"
  ],
  "calions-app/env": [
    "1.0.0"
  ],
  "calions-app/jsonapi-http": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0"
  ],
  "calions-app/jsonapi-http-retry": [
    "1.0.0",
    "2.0.0"
  ],
  "calions-app/remote-resource": [
    "1.0.0"
  ],
  "calions-app/test-attribute": [
    "1.0.0"
  ],
  "camjc/elm-chart": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "camjc/elm-quiz": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.1.0",
    "1.1.1"
  ],
  "canadaduane/elm-hccb": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "capitalist/elm-octicons": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0"
  ],
  "cappyzawa/elm-ui-colors": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "cappyzawa/elm-ui-onedark": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "careport/elm-avl": [
    "1.0.0",
    "1.1.0"
  ],
  "carlsson87/mod10": [
    "1.0.0",
    "2.0.0"
  ],
  "carlsson87/mod11": [
    "1.0.0",
    "1.0.1"
  ],
  "carmonw/elm-number-to-words": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "carpe/elm-data": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5"
  ],
  "carwow/elm-core": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "4.0.6",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.0.4",
    "7.0.5",
    "7.0.6",
    "8.0.0",
    "9.0.0"
  ],
  "carwow/elm-slider": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "8.0.0",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "11.1.0",
    "11.1.1",
    "11.1.2",
    "11.1.3",
    "11.1.4",
    "11.1.5",
    "11.1.6"
  ],
  "carwow/elm-slider-old": [
    "1.0.0",
    "2.0.0"
  ],
  "carwow/elm-theme": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0",
    "4.1.1",
    "4.2.0",
    "4.3.0",
    "4.3.1",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "11.0.1",
    "11.1.0",
    "11.2.0"
  ],
  "ccapndave/elm-eexl": [
    "1.0.0"
  ],
  "ccapndave/elm-effects-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ccapndave/elm-flat-map": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.2.0"
  ],
  "ccapndave/elm-list-map": [
    "1.0.0"
  ],
  "ccapndave/elm-reflect": [
    "1.0.0"
  ],
  "ccapndave/elm-statecharts": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1"
  ],
  "ccapndave/elm-translator": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.2.0"
  ],
  "ccapndave/elm-typed-tree": [
    "1.0.0"
  ],
  "ccapndave/elm-update-extra": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "3.0.0",
    "4.0.0"
  ],
  "ccapndave/focus": [
    "2.1.0",
    "3.0.0"
  ],
  "ceddlyburge/elm-bootstrap-starter-master-view": [
    "1.0.0"
  ],
  "ceddlyburge/elm-collections": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "cedric-h/elm-google-sign-in": [
    "1.0.0",
    "2.0.0"
  ],
  "cedricss/elm-css-systems": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.1.0"
  ],
  "cedricss/elm-form-machine": [
    "1.0.0"
  ],
  "cedricss/elm-progress-ring": [
    "1.0.0",
    "1.0.1"
  ],
  "chain-partners/elm-bignum": [
    "1.0.0",
    "1.0.1"
  ],
  "chazsconi/elm-phoenix-ports": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "chemirea/bulma-classes": [
    "1.0.0"
  ],
  "chendrix/elm-matrix": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3"
  ],
  "chendrix/elm-numpad": [
    "1.0.0",
    "1.0.1"
  ],
  "chicode/lisa": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.1.1",
    "5.1.2",
    "5.1.3",
    "5.1.4",
    "5.1.5"
  ],
  "choonkeat/elm-retry": [
    "1.0.0",
    "1.0.1"
  ],
  "chrilves/elm-io": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0"
  ],
  "chrisalmeida/graphqelm": [
    "1.0.0",
    "1.0.1"
  ],
  "chrisbuttery/elm-greeting": [
    "1.0.0",
    "1.0.1"
  ],
  "chrisbuttery/elm-parting": [
    "1.0.0",
    "1.0.1"
  ],
  "chrisbuttery/elm-scroll-progress": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "chrisbuttery/is-online": [
    "1.0.1",
    "1.0.2"
  ],
  "chrisbuttery/reading-time": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "circuithub/elm-array-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "circuithub/elm-array-focus": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "circuithub/elm-bootstrap-html": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "6.1.0",
    "6.2.0",
    "6.3.0",
    "6.3.1",
    "6.3.2",
    "6.3.3",
    "6.3.4",
    "7.0.0"
  ],
  "circuithub/elm-dropdown": [
    "1.0.0"
  ],
  "circuithub/elm-filepickerio-api-types": [
    "1.0.0"
  ],
  "circuithub/elm-function-extra": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "1.1.7",
    "1.1.8",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "circuithub/elm-graphics-shorthand": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "circuithub/elm-html-extra": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.5.2"
  ],
  "circuithub/elm-html-shorthand": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "9.0.2",
    "9.0.3",
    "9.0.4",
    "10.0.0",
    "11.0.0"
  ],
  "circuithub/elm-json-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.2.1"
  ],
  "circuithub/elm-list-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.4.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0",
    "3.4.0",
    "3.5.0",
    "3.6.0",
    "3.7.0",
    "3.7.1",
    "3.8.0",
    "3.9.0",
    "3.10.0"
  ],
  "circuithub/elm-list-signal": [
    "1.0.0",
    "2.0.0"
  ],
  "circuithub/elm-list-split": [
    "1.0.0",
    "1.0.1"
  ],
  "circuithub/elm-maybe-extra": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.6.0"
  ],
  "circuithub/elm-number-format": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "circuithub/elm-result-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0"
  ],
  "circuithub/elm-string-split": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "cjduncana/three-words": [
    "1.0.0"
  ],
  "cjmeeks/elm-calendar": [
    "1.0.0"
  ],
  "ckoster22/elm-genetic": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "clojj/elm-css-grid": [
    "1.0.0",
    "1.0.1"
  ],
  "cmditch/elm-bigint": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "cmditch/elm-ethereum": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0",
    "4.0.1",
    "5.0.0"
  ],
  "cmditch/mel-bew3": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "8.0.0",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "12.0.0",
    "13.0.0",
    "13.0.1"
  ],
  "cobalamin/elm-json-extra": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "cobalamin/history-tree": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0"
  ],
  "cobalamin/safe-int": [
    "1.0.0"
  ],
  "coinop-logan/elm-format-number": [
    "1.0.0"
  ],
  "coinop-logan/phace": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "commonmind/elm-csexpr": [
    "1.0.0",
    "1.1.0"
  ],
  "commonmind/elm-csv-encode": [
    "1.0.0",
    "1.0.1"
  ],
  "comsysto/harvest-api": [
    "1.0.0",
    "1.0.1"
  ],
  "coreytrampe/elm-vendor": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "correl/elm-paginated": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0"
  ],
  "cotterjd/elm-mdl": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "crazymykl/ex-em-elm": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0"
  ],
  "csicar/elm-mathui": [
    "1.0.0",
    "2.0.0"
  ],
  "cuducos/elm-format-number": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.0.4",
    "5.0.5",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.1.0",
    "6.2.0",
    "7.0.0",
    "8.0.0",
    "8.1.0",
    "8.1.1",
    "8.1.2"
  ],
  "cultureamp/babel-elm-assets-plugin": [
    "1.0.0",
    "1.0.1"
  ],
  "cultureamp/elm-css-modules-loader": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "2.0.7",
    "2.0.8",
    "2.0.9",
    "2.0.10"
  ],
  "cutsea110/elm-temperature": [
    "1.0.0",
    "1.0.1"
  ],
  "dailydrip/elm-emoji": [
    "1.0.0",
    "1.0.1"
  ],
  "dalen/elm-charts": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "damienklinnert/elm-hue": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1"
  ],
  "damienklinnert/elm-spinner": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "damukles/elm-dialog": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "danabrams/elm-media": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.4",
    "2.0.5",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5"
  ],
  "danabrams/elm-media-source": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "danfishgold/base64-bytes": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "danhandrea/elm-date-format": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "danhandrea/elm-foo": [
    "1.0.0"
  ],
  "danhandrea/elm-router": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "danielnarey/elm-color-math": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1"
  ],
  "danielnarey/elm-css-basics": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.1.0"
  ],
  "danielnarey/elm-css-math": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "danielnarey/elm-font-import": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "danielnarey/elm-form-capture": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "danielnarey/elm-input-validation": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "danielnarey/elm-modular-ui": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "danielnarey/elm-semantic-dom": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "3.0.0"
  ],
  "danielnarey/elm-semantic-effects": [
    "1.0.0",
    "1.0.1"
  ],
  "danielnarey/elm-stylesheet": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.1.1"
  ],
  "danielnarey/elm-toolkit": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "4.4.0",
    "4.5.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.1.0",
    "6.1.1",
    "6.2.0"
  ],
  "danmarcab/elm-retroactive": [
    "1.0.0"
  ],
  "danmarcab/material-icons": [
    "1.0.0"
  ],
  "danyx23/elm-dropzone": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "danyx23/elm-mimetype": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1"
  ],
  "danyx23/elm-uuid": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "dasch/crockford": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0"
  ],
  "dasch/elm-basics-extra": [
    "1.0.0"
  ],
  "dasch/levenshtein": [
    "1.0.0",
    "1.0.1"
  ],
  "dasch/parser": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "data-viz-lab/elm-chart-builder": [
    "1.0.0",
    "2.0.0"
  ],
  "davcamer/elm-protobuf": [
    "1.0.0"
  ],
  "davidpelaez/elm-scenic": [
    "1.0.0",
    "1.0.1"
  ],
  "dawehner/elm-colorbrewer": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "deadfoxygrandpa/elm-architecture": [
    "1.0.0"
  ],
  "deadfoxygrandpa/elm-test": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1"
  ],
  "debois/elm-dom": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "1.3.0"
  ],
  "debois/elm-mdl": [
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "6.0.4",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "7.4.0",
    "7.5.0",
    "7.6.0",
    "8.0.0",
    "8.0.1",
    "8.1.0"
  ],
  "debois/elm-parts": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0"
  ],
  "declension/elm-obj-loader": [
    "1.0.0",
    "1.0.1"
  ],
  "derekdreery/elm-die-faces": [
    "1.0.0"
  ],
  "derrickreimer/elm-keys": [
    "1.0.0",
    "1.1.0"
  ],
  "dhruvin2910/elm-css": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "dillonkearns/elm-cli-options-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "dillonkearns/elm-graphql": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.2.1",
    "4.3.0",
    "4.3.1",
    "4.4.0",
    "4.5.0",
    "5.0.0"
  ],
  "dillonkearns/elm-markdown": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2"
  ],
  "dillonkearns/elm-oembed": [
    "1.0.0"
  ],
  "dillonkearns/elm-pages": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0"
  ],
  "dillonkearns/elm-rss": [
    "1.0.0",
    "1.0.1"
  ],
  "dillonkearns/elm-sitemap": [
    "1.0.0",
    "1.0.1"
  ],
  "dillonkearns/graphqelm": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "8.0.0",
    "8.0.1",
    "9.0.0",
    "9.1.0",
    "10.0.0",
    "10.1.0",
    "10.2.0",
    "11.0.0",
    "11.1.0",
    "11.2.0"
  ],
  "dillonkearns/graphqelm-demo": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.1.0",
    "6.1.1"
  ],
  "dividat/elm-identicon": [
    "1.0.0"
  ],
  "dividat/elm-semver": [
    "1.0.0",
    "2.0.0"
  ],
  "dmy/elm-imf-date-time": [
    "1.0.0",
    "1.0.1"
  ],
  "dmy/elm-pratt-parser": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "doanythingfordethklok/snackbar": [
    "1.0.0"
  ],
  "doodledood/elm-split-pane": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0",
    "4.0.1",
    "5.0.0"
  ],
  "dosarf/elm-activemq": [
    "1.0.0",
    "1.0.1"
  ],
  "dosarf/elm-guarded-input": [
    "1.0.0"
  ],
  "dosarf/elm-tree-view": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "dosarf/elm-yet-another-polling": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "drathier/elm-graph": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "drathier/elm-test-graph": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "drathier/elm-test-tables": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "driebit/elm-css-breakpoint": [
    "1.0.0",
    "1.0.1"
  ],
  "driebit/elm-ginger": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "driebit/elm-html-unsafe-headers": [
    "1.0.0",
    "1.0.1"
  ],
  "driebit/elm-max-size-dict": [
    "1.0.0"
  ],
  "drojas/elm-http-parser": [
    "1.0.0",
    "2.0.0"
  ],
  "drojas/elm-task-middleware": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0"
  ],
  "dtraft/elm-classnames": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "dullbananas/elm-touch": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "duncanmalashock/json-rest-api": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "dustinfarris/elm-autocomplete": [
    "1.0.0",
    "1.0.1"
  ],
  "dustinspecker/capitalize-word": [
    "1.0.0"
  ],
  "dustinspecker/dict-key-values": [
    "1.0.0"
  ],
  "dustinspecker/is-fibonacci-number": [
    "1.0.0"
  ],
  "dustinspecker/last": [
    "1.0.0",
    "1.0.1"
  ],
  "dustinspecker/list-join-conjunction": [
    "1.0.0"
  ],
  "dustinspecker/us-states": [
    "1.0.0",
    "1.0.1"
  ],
  "dvberkel/microkanren": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "dwyl/elm-criteria": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1"
  ],
  "dwyl/elm-datepicker": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0"
  ],
  "dwyl/elm-input-tables": [
    "1.0.0",
    "2.0.0"
  ],
  "dzuk-mutant/internettime": [
    "1.0.0"
  ],
  "eddylane/elm-flip-animation": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "edkv/elm-components": [
    "1.0.0"
  ],
  "edkv/elm-generic-dict": [
    "1.0.0"
  ],
  "edvail/elm-polymer": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "2.0.0",
    "3.0.0"
  ],
  "eelcoh/parser-indent": [
    "1.0.0"
  ],
  "eeue56/elm-all-dict": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "2.0.1"
  ],
  "eeue56/elm-alternative-json": [
    "1.0.0"
  ],
  "eeue56/elm-debug-json-view": [
    "1.0.0"
  ],
  "eeue56/elm-default-dict": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "eeue56/elm-flat-matrix": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.3.2",
    "1.3.3",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.6.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0"
  ],
  "eeue56/elm-html-in-elm": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.2.0"
  ],
  "eeue56/elm-html-query": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "3.0.0"
  ],
  "eeue56/elm-html-test": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "5.1.0",
    "5.1.1",
    "5.1.2",
    "5.1.3",
    "5.2.0"
  ],
  "eeue56/elm-http-error-view": [
    "1.0.0"
  ],
  "eeue56/elm-json-field-value": [
    "1.0.0"
  ],
  "eeue56/elm-lazy": [
    "1.0.0"
  ],
  "eeue56/elm-lazy-list": [
    "1.0.0"
  ],
  "eeue56/elm-pretty-print-json": [
    "1.0.0"
  ],
  "eeue56/elm-shrink": [
    "1.0.0"
  ],
  "eeue56/elm-simple-data": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0"
  ],
  "eeue56/elm-stringify": [
    "1.0.1",
    "1.0.0",
    "1.0.2"
  ],
  "eeue56/elm-xml": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.2.3"
  ],
  "egillet/elm-sortable-table": [
    "2.0.0",
    "2.0.1"
  ],
  "eike/json-decode-complete": [
    "1.0.0",
    "1.0.1"
  ],
  "elb17/multiselect-menu": [
    "1.0.0",
    "1.0.1"
  ],
  "eliaslfox/orderedmap": [
    "1.0.0"
  ],
  "eliaslfox/queue": [
    "1.0.0"
  ],
  "elm/browser": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm/bytes": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8"
  ],
  "elm/core": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "elm/file": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "elm/html": [
    "1.0.0"
  ],
  "elm/http": [
    "1.0.0",
    "2.0.0"
  ],
  "elm/json": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "elm/parser": [
    "1.0.0",
    "1.1.0"
  ],
  "elm/project-metadata-utils": [
    "1.0.0",
    "1.0.1"
  ],
  "elm/random": [
    "1.0.0"
  ],
  "elm/regex": [
    "1.0.0"
  ],
  "elm/svg": [
    "1.0.0",
    "1.0.1"
  ],
  "elm/time": [
    "1.0.0"
  ],
  "elm/url": [
    "1.0.0"
  ],
  "elm/virtual-dom": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-athlete/athlete": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.3.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "6.0.2"
  ],
  "elm-bodybuilder/elegant": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.1.0",
    "7.1.1",
    "7.1.2"
  ],
  "elm-bodybuilder/elm-function": [
    "1.0.0"
  ],
  "elm-bodybuilder/formbuilder": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0"
  ],
  "elm-bodybuilder/formbuilder-autocomplete": [
    "1.0.0",
    "2.0.0"
  ],
  "elm-bodybuilder/formbuilder-photo": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-canvas/element-relative-mouse-events": [
    "1.0.0"
  ],
  "elm-canvas/raster-shapes": [
    "1.0.0"
  ],
  "elm-community/array-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "elm-community/basics-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "2.3.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.1.0"
  ],
  "elm-community/dict-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.3.2",
    "1.4.0",
    "1.5.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.4.0"
  ],
  "elm-community/easing-functions": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "elm-community/elm-check": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "elm-community/elm-datepicker": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "7.2.1",
    "7.2.2",
    "7.2.3",
    "7.2.4",
    "7.2.5",
    "7.2.6"
  ],
  "elm-community/elm-history": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.2.0"
  ],
  "elm-community/elm-json-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-community/elm-lazy-list": [
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.0.0"
  ],
  "elm-community/elm-linear-algebra": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "elm-community/elm-list-extra": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "elm-community/elm-material-icons": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "elm-community/elm-random-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-community/elm-test": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.2.0"
  ],
  "elm-community/elm-time": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9",
    "1.0.10",
    "1.0.11",
    "1.0.12",
    "1.0.13",
    "1.0.14",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "elm-community/elm-webgl": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "elm-community/graph": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "6.0.0"
  ],
  "elm-community/html-extra": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0",
    "3.4.0"
  ],
  "elm-community/html-test-runner": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7"
  ],
  "elm-community/intdict": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "elm-community/json-extra": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.5.0",
    "2.6.0",
    "2.7.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.3.0"
  ],
  "elm-community/lazy-list": [
    "1.0.0"
  ],
  "elm-community/linear-algebra": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2"
  ],
  "elm-community/list-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.0.1",
    "7.1.0",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "8.2.1",
    "8.2.2",
    "8.2.3",
    "8.2.4"
  ],
  "elm-community/list-split": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "elm-community/material-icons": [
    "1.0.0",
    "1.1.0"
  ],
  "elm-community/maybe-extra": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.2.0"
  ],
  "elm-community/parser-combinators": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "elm-community/random-extra": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0"
  ],
  "elm-community/ratio": [
    "1.0.0",
    "1.1.0"
  ],
  "elm-community/result-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "2.4.0"
  ],
  "elm-community/shrink": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "elm-community/string-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.3.2",
    "1.3.3",
    "1.4.0",
    "1.5.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1"
  ],
  "elm-community/svg-extra": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-community/typed-svg": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.1.0",
    "5.2.0",
    "6.0.0"
  ],
  "elm-community/undo-redo": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0"
  ],
  "elm-community/webgl": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5"
  ],
  "elm-explorations/benchmark": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-explorations/linear-algebra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "elm-explorations/markdown": [
    "1.0.0"
  ],
  "elm-explorations/test": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "elm-explorations/webgl": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "elm-in-elm/compiler": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/animation-frame": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/core": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "5.0.0",
    "5.1.0",
    "5.1.1"
  ],
  "elm-lang/dom": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "elm-lang/geolocation": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-lang/html": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "elm-lang/http": [
    "1.0.0"
  ],
  "elm-lang/keyboard": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/lazy": [
    "1.0.0",
    "2.0.0"
  ],
  "elm-lang/mouse": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/navigation": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "elm-lang/page-visibility": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/svg": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "elm-lang/trampoline": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-lang/virtual-dom": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "elm-lang/websocket": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "elm-lang/window": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-scotland/elm-tries": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-tools/documentation": [
    "1.0.0",
    "1.0.1"
  ],
  "elm-tools/parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "elm-tools/parser-primitives": [
    "1.0.0"
  ],
  "elm-toulouse/cbor": [
    "1.0.0"
  ],
  "elm-toulouse/float16": [
    "1.0.0",
    "1.0.1"
  ],
  "emilianobovetti/edit-distance": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "emilianobovetti/elm-yajson": [
    "1.0.0",
    "2.0.0"
  ],
  "emilyhorsman/elm-speechrecognition-interop": [
    "1.0.0"
  ],
  "emptyflash/typed-svg": [
    "1.0.0",
    "1.1.0"
  ],
  "emtenet/elm-component-support": [
    "1.0.0"
  ],
  "enetsee/elm-color-interpolate": [
    "1.0.0"
  ],
  "enetsee/elm-facet-scenegraph": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "12.0.0"
  ],
  "enetsee/elm-scale": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8"
  ],
  "enetsee/facet-plot-alpha": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "enetsee/facet-render-svg-alpha": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "enetsee/facet-scenegraph-alpha": [
    "1.0.0"
  ],
  "enetsee/facet-theme-alpha": [
    "1.0.0"
  ],
  "enetsee/rangeslider": [
    "1.0.0",
    "2.0.0"
  ],
  "enetsee/typed-format": [
    "1.0.0",
    "1.0.1"
  ],
  "engagesoftware/elm-dnn-localization": [
    "1.0.0"
  ],
  "ensoft/entrance": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "ericgj/elm-accordion-menu": [
    "1.0.0"
  ],
  "ericgj/elm-autoinput": [
    "1.0.0",
    "2.0.0"
  ],
  "ericgj/elm-csv-decode": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "ericgj/elm-quantiles": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "ericgj/elm-uri-template": [
    "1.0.0",
    "1.0.1"
  ],
  "ericgj/elm-validation": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "eriktim/elm-protocol-buffers": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "erlandsona/assoc-set": [
    "1.0.0",
    "1.1.0"
  ],
  "erosson/number-suffix": [
    "1.0.0",
    "1.1.0"
  ],
  "ersocon/creditcard-validation": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "erwald/elm-edit-distance": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "esanmiguelc/elm-validate": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "eskimoblood/elm-color-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.2.1",
    "3.2.2",
    "3.2.3",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "5.0.0",
    "5.1.0"
  ],
  "eskimoblood/elm-parametric-surface": [
    "1.0.0"
  ],
  "eskimoblood/elm-simplex-noise": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3"
  ],
  "eskimoblood/elm-wallpaper": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4",
    "2.1.5"
  ],
  "etaque/elm-dialog": [
    "1.0.0",
    "1.1.0"
  ],
  "etaque/elm-form": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0"
  ],
  "etaque/elm-hexagons": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "etaque/elm-response": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0"
  ],
  "etaque/elm-route-parser": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0"
  ],
  "etaque/elm-simple-form": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "5.0.0",
    "5.0.1"
  ],
  "etaque/elm-simple-form-infix": [
    "1.0.0"
  ],
  "etaque/elm-transit": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.0.4",
    "7.0.5"
  ],
  "etaque/elm-transit-router": [
    "1.0.0",
    "1.0.1"
  ],
  "etaque/elm-transit-style": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0"
  ],
  "evancz/automaton": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "evancz/elm-effects": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "evancz/elm-graphics": [
    "1.0.0",
    "1.0.1"
  ],
  "evancz/elm-html": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0"
  ],
  "evancz/elm-http": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "evancz/elm-markdown": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "evancz/elm-playground": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "evancz/elm-sortable-table": [
    "1.0.1"
  ],
  "evancz/elm-svg": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "evancz/focus": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "evancz/start-app": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "evancz/task-tutorial": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "evancz/url-parser": [
    "2.0.0",
    "2.0.1"
  ],
  "evancz/virtual-dom": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "2.0.0",
    "2.1.0"
  ],
  "exdis/elm-sample-package": [
    "1.0.0"
  ],
  "f0i/iso8601": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "f0i/statistics": [
    "1.0.0",
    "2.0.0"
  ],
  "fabhof/elm-ui-datepicker": [
    "1.0.0",
    "2.0.0"
  ],
  "fabiommendes/elm-bricks": [
    "1.0.0",
    "2.0.0"
  ],
  "fabiommendes/elm-dynamic-forms": [
    "1.0.0"
  ],
  "fabiommendes/elm-iter": [
    "1.0.0"
  ],
  "fabiommendes/elm-sexpr": [
    "1.0.0",
    "1.0.1"
  ],
  "fapian/elm-html-aria": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.3.1",
    "1.4.0"
  ],
  "fauu/elm-selectable-text": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "fbonetti/elm-geodesy": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "fbonetti/elm-phoenix-socket": [
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0"
  ],
  "fdbeirao/elm-sliding-list": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0"
  ],
  "feathericons/elm-feather": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.4.0",
    "1.5.0"
  ],
  "fedragon/elm-typed-dropdown": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "felipesere/elm-github-colors": [
    "1.0.0"
  ],
  "fiatjaf/hashbow-elm": [
    "1.0.0"
  ],
  "fifth-postulate/combinatorics": [
    "1.0.0"
  ],
  "fifth-postulate/elm-csv-decode": [
    "1.0.0"
  ],
  "fifth-postulate/priority-queue": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-entity": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-graph": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-ui-preview": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-ui-preview-tag": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-ui-tag": [
    "1.0.0"
  ],
  "flarebyte/bubblegum-ui-textarea": [
    "1.0.0"
  ],
  "flarebyte/ntriples-filter": [
    "1.0.0"
  ],
  "flowlang-cc/elm-audio-graph": [
    "1.0.0",
    "1.0.1"
  ],
  "folkertdev/elm-bounding-box": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "folkertdev/elm-brotli": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "folkertdev/elm-cff": [
    "1.0.0"
  ],
  "folkertdev/elm-deque": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "folkertdev/elm-flate": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "folkertdev/elm-hexbin": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "folkertdev/elm-int64": [
    "1.0.0"
  ],
  "folkertdev/elm-iris": [
    "1.0.0"
  ],
  "folkertdev/elm-kmeans": [
    "1.0.0"
  ],
  "folkertdev/elm-paragraph": [
    "1.0.0"
  ],
  "folkertdev/elm-sha2": [
    "1.0.0"
  ],
  "folkertdev/elm-state": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1"
  ],
  "folkertdev/elm-tiny-inflate": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "folkertdev/elm-treemap": [
    "1.0.0"
  ],
  "folkertdev/one-true-path-experiment": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "5.0.0"
  ],
  "folkertdev/outmessage": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1"
  ],
  "folkertdev/svg-path-dsl": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "folkertdev/svg-path-lowlevel": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "folq/review-rgb-ranges": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "francescortiz/elm-queue": [
    "1.0.0"
  ],
  "frandibar/elm-bootstrap": [
    "1.0.1",
    "2.0.0",
    "2.1.0"
  ],
  "frandibar/elm-font-awesome-5": [
    "1.0.0"
  ],
  "frawa/elm-contour": [
    "1.0.0"
  ],
  "fredcy/elm-debouncer": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "fredcy/elm-defer-command": [
    "1.0.0",
    "1.0.1"
  ],
  "fredcy/elm-parseint": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.3.0",
    "2.0.0",
    "1.3.1",
    "2.0.1"
  ],
  "fredcy/elm-timer": [
    "1.0.0",
    "1.0.1"
  ],
  "fresheyeball/elm-check-runner": [
    "1.0.0"
  ],
  "friedbrice/elm-teaching-tools": [
    "1.0.0",
    "1.0.1"
  ],
  "fustkilas/elm-airtable": [
    "1.0.0"
  ],
  "gaborv/debouncer": [
    "1.0.0",
    "1.0.1"
  ],
  "gampleman/elm-examples-helper": [
    "1.0.0"
  ],
  "gampleman/elm-mapbox": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0"
  ],
  "gampleman/elm-visualization": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.6.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "garetht/elm-dynamic-style": [
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0"
  ],
  "gdamjan/elm-identicon": [
    "1.0.0"
  ],
  "gege251/elm-validator-pipeline": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "genthaler/elm-enum": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "geppettodivacin/elm-couchdb": [
    "1.0.0",
    "2.0.0"
  ],
  "getsurance/elm-street": [
    "1.0.0",
    "2.0.0"
  ],
  "getto-systems/elm-apply": [
    "1.0.0",
    "2.0.0"
  ],
  "getto-systems/elm-command": [
    "1.0.0"
  ],
  "getto-systems/elm-field": [
    "1.0.0",
    "2.0.0"
  ],
  "getto-systems/elm-html-table": [
    "1.0.0"
  ],
  "getto-systems/elm-http-header": [
    "1.0.0"
  ],
  "getto-systems/elm-http-part": [
    "1.0.0"
  ],
  "getto-systems/elm-json": [
    "1.0.0"
  ],
  "getto-systems/elm-sort": [
    "1.0.0"
  ],
  "getto-systems/elm-url": [
    "1.0.0"
  ],
  "getto-systems/getto-elm-command": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ggb/elm-bloom": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "ggb/elm-sentiment": [
    "1.0.0",
    "1.0.1"
  ],
  "ggb/elm-trend": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "ggb/numeral-elm": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.4.2",
    "1.4.3"
  ],
  "ggb/porterstemmer": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "ghivert/elm-cloudinary": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "ghivert/elm-colors": [
    "1.0.0",
    "1.1.0"
  ],
  "ghivert/elm-data-dumper": [
    "1.0.0",
    "1.1.0"
  ],
  "ghivert/elm-graphql": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0",
    "3.4.0",
    "3.5.0",
    "4.0.0",
    "5.0.0"
  ],
  "ghivert/elm-mapbox": [
    "1.0.0"
  ],
  "gicentre/elm-vega": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "2.3.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "4.3.1",
    "5.0.0",
    "5.1.0",
    "5.2.0",
    "5.3.0",
    "5.4.0",
    "5.5.0"
  ],
  "gicentre/elm-vegalite": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.7.0",
    "1.8.0",
    "1.9.0",
    "1.10.0",
    "1.11.0",
    "1.12.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "gicentre/tidy": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0"
  ],
  "gigobyte/iso8601-duration": [
    "1.0.0"
  ],
  "gilbertkennen/bigint": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "gilesbowkett/html-escape-sequences": [
    "1.0.0"
  ],
  "gingko/time-distance": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.2.1",
    "2.3.0"
  ],
  "gipsy-king/radar-chart": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "glasserc/elm-debouncer": [
    "1.0.0"
  ],
  "glasserc/elm-form-result": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "glasserc/elm-requested": [
    "1.0.0"
  ],
  "gmauricio/elm-semantic-ui": [
    "1.0.0"
  ],
  "goilluminate/elm-fancy-daterangepicker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.1.1",
    "5.1.2",
    "5.1.3",
    "6.0.0"
  ],
  "gribouille/elm-graphql": [
    "1.0.0"
  ],
  "gribouille/elm-prelude": [
    "1.0.0"
  ],
  "gribouille/elm-table": [
    "1.0.0"
  ],
  "gribouille/elm-treeview": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "groteck/elm-iban": [
    "1.0.0",
    "1.1.0"
  ],
  "grotsev/elm-debouncer": [
    "1.0.0"
  ],
  "grrinchas/elm-graphql-client": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "grrinchas/elm-natural": [
    "1.0.0"
  ],
  "guid75/ziplist": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "h0lyalg0rithm/elm-select": [
    "1.0.0"
  ],
  "hakonrossebo/elmdocs": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "halfzebra/elm-aframe": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0"
  ],
  "halfzebra/elm-sierpinski": [
    "1.0.0",
    "1.0.1"
  ],
  "hanshoglund/elm-interval": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "hardfire/elm-ad-bs": [
    "1.0.0",
    "1.0.1"
  ],
  "harmboschloo/elm-dict-intersect": [
    "1.0.0"
  ],
  "harmboschloo/elm-ecs": [
    "1.0.0",
    "2.0.0"
  ],
  "harmboschloo/graphql-to-elm": [
    "1.0.0"
  ],
  "harmboschloo/graphql-to-elm-package": [
    "1.0.0",
    "1.0.1"
  ],
  "harrysarson/elm-complex": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "harrysarson/elm-decode-elmi": [
    "1.0.0"
  ],
  "harrysarson/elm-hacky-unique": [
    "1.0.0"
  ],
  "hawx/elm-mixpanel": [
    "1.0.0",
    "2.0.0"
  ],
  "hecrj/composable-form": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.2.3",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.1.0",
    "8.0.0",
    "8.0.1"
  ],
  "hecrj/elm-slug": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "hecrj/html-parser": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "2.3.3",
    "2.3.4"
  ],
  "hendore/elm-adorable-avatars": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "hendore/elm-port-message": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "hendore/elm-temperature": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "henne90gen/elm-pandas-visualization": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "hercules-ci/elm-dropdown": [
    "1.0.0",
    "1.0.1"
  ],
  "hercules-ci/elm-hercules-extras": [
    "1.0.0"
  ],
  "hermanverschooten/ip": [
    "1.0.0",
    "1.0.1"
  ],
  "heyLu/elm-format-date": [
    "1.0.0"
  ],
  "hickscorp/elm-bigint": [
    "1.0.0",
    "1.0.2"
  ],
  "hmsk/elm-css-modern-normalize": [
    "1.0.0",
    "1.0.1"
  ],
  "hoelzro/elm-drag": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "holmusk/timed-cache": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "hrldcpr/elm-cons": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0"
  ],
  "hugobessaa/elm-logoot": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1"
  ],
  "humio/elm-dashboard": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1"
  ],
  "ianmackenzie/elm-1d-parameter": [
    "1.0.0",
    "1.0.1"
  ],
  "ianmackenzie/elm-3d-camera": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.1.0"
  ],
  "ianmackenzie/elm-3d-scene": [
    "1.0.0",
    "1.0.1"
  ],
  "ianmackenzie/elm-float-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "ianmackenzie/elm-geometry": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0",
    "3.4.0",
    "3.5.0",
    "3.6.0"
  ],
  "ianmackenzie/elm-geometry-linear-algebra-interop": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "ianmackenzie/elm-geometry-prerelease": [
    "1.0.0",
    "1.0.1"
  ],
  "ianmackenzie/elm-geometry-svg": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0"
  ],
  "ianmackenzie/elm-geometry-test": [
    "1.0.0"
  ],
  "ianmackenzie/elm-interval": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "ianmackenzie/elm-iso-10303": [
    "1.0.0"
  ],
  "ianmackenzie/elm-step-file": [
    "1.0.0",
    "1.0.1"
  ],
  "ianmackenzie/elm-triangular-mesh": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "ianmackenzie/elm-units": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.5.0",
    "2.5.1",
    "2.6.0"
  ],
  "ianmackenzie/elm-units-interval": [
    "1.0.0",
    "1.1.0"
  ],
  "ianp/elm-datepicker": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "icidasset/css-support": [
    "1.0.0"
  ],
  "icidasset/elm-binary": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0"
  ],
  "icidasset/elm-material-icons": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.1.0"
  ],
  "icidasset/elm-sha": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "identicalsnowflake/elm-dynamic-style": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "identicalsnowflake/elm-typed-styles": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0"
  ],
  "imbybio/cachedremotedata": [
    "1.0.0",
    "1.0.1"
  ],
  "imbybio/outmessage-nested": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "imeckler/either": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "imeckler/empty": [
    "1.0.0",
    "2.0.0"
  ],
  "imeckler/iterator": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0"
  ],
  "imeckler/piece": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "imeckler/queue": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "imeckler/ratio": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "2.0.0",
    "2.0.1"
  ],
  "imeckler/stage": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "2.0.0"
  ],
  "imjoehaines/afinn-165-elm": [
    "1.0.0"
  ],
  "indicatrix/elm-chartjs-webcomponent": [
    "1.0.0"
  ],
  "indicatrix/elm-input-extra": [
    "1.0.0",
    "1.0.1"
  ],
  "ingara/elm-asoiaf-api": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "inkuzmin/elm-multiselect": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "innoave/bounded-number": [
    "1.0.0"
  ],
  "insurello/elm-swedish-bank-account-number": [
    "1.0.0"
  ],
  "insurello/elm-ui-explorer": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "iodevs/elm-history": [
    "1.0.0"
  ],
  "iodevs/elm-validate": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "iosphere/elm-i18n": [
    "1.0.0"
  ],
  "iosphere/elm-logger": [
    "1.0.0",
    "1.0.1"
  ],
  "iosphere/elm-network-graph": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0"
  ],
  "iosphere/elm-toast": [
    "1.0.0"
  ],
  "ir4y/elm-cursor": [
    "1.0.0",
    "2.0.0"
  ],
  "ir4y/elm-dnd": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "isaacseymour/deprecated-time": [
    "1.0.0"
  ],
  "isberg/elm-ann": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.5.2",
    "1.5.3",
    "1.6.0",
    "1.6.1",
    "1.6.2"
  ],
  "itravel-de/elm-thumbor": [
    "1.0.0"
  ],
  "ivadzy/bbase64": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "j-panasiuk/elm-ionicons": [
    "1.0.0",
    "2.0.0"
  ],
  "jabaraster/elm-views": [
    "1.0.0",
    "1.1.0"
  ],
  "jackfranklin/elm-console-log": [
    "1.0.0"
  ],
  "jackfranklin/elm-parse-link-header": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "jackfranklin/elm-statey": [
    "1.0.0",
    "2.0.0"
  ],
  "jackhp95/elm-mapbox": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "jackhp95/palit": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "jackwillis/elm-dialog": [
    "1.0.0",
    "1.0.1"
  ],
  "jahewson/elm-graphql-module": [
    "1.0.0"
  ],
  "jamby1100/elm-blog-engine": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "2.0.0"
  ],
  "jamesgary/elm-config-ui": [
    "1.0.0"
  ],
  "jamesmacaulay/elm-graphql": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.3.2",
    "1.3.3",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.6.1",
    "1.7.0",
    "1.8.0",
    "2.0.0"
  ],
  "jamesmacaulay/elm-json-bidirectional": [
    "1.0.0",
    "1.1.0"
  ],
  "janjelinek/creditcard-validation": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jaredramirez/elm-field": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "jaredramirez/elm-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jaredramirez/elm-s3": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0"
  ],
  "jasonliang512/elm-heroicons": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0"
  ],
  "jasonmahr/html-escape-sequences": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "1.0.2",
    "2.0.2",
    "2.0.3",
    "1.0.3",
    "2.0.4",
    "1.0.4",
    "1.0.5",
    "2.0.5"
  ],
  "jastice/boxes-and-bubbles": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "jastice/forkithardermakeitbetter": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0"
  ],
  "jastice/president": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "javcasas/elm-decimal": [
    "1.0.0",
    "1.0.1"
  ],
  "javcasas/elm-integer": [
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "jcollard/elm-playground": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jcollard/key-constants": [
    "1.0.0",
    "1.0.1"
  ],
  "jeffesp/elm-vega": [
    "2.0.3"
  ],
  "jergason/elm-hash": [
    "1.0.0"
  ],
  "jessitron/elm-http-with-headers": [
    "1.0.0",
    "1.1.0"
  ],
  "jessitron/elm-param-parsing": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jfairbank/elm-stream": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "jfmengels/elm-lint": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2"
  ],
  "jfmengels/elm-lint-reporter": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jfmengels/elm-review": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.2.0"
  ],
  "jfmengels/elm-review-reporter": [
    "1.0.0"
  ],
  "jfmengels/lint-debug": [
    "1.0.0",
    "1.0.1"
  ],
  "jfmengels/lint-unused": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jfmengels/review-common": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "jfmengels/review-debug": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "jfmengels/review-documentation": [
    "1.0.0"
  ],
  "jfmengels/review-tea": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "jfmengels/review-unused": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3"
  ],
  "jgrenat/elm-html-test-runner": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jgrenat/regression-testing": [
    "1.0.0"
  ],
  "jigargosar/elm-material-color": [
    "1.0.0"
  ],
  "jims/graphqelm": [
    "1.0.0"
  ],
  "jims/html-parser": [
    "1.0.0"
  ],
  "jinjor/elm-contextmenu": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "2.0.0"
  ],
  "jinjor/elm-csv-decode": [
    "1.0.0",
    "1.0.1"
  ],
  "jinjor/elm-debounce": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0"
  ],
  "jinjor/elm-diff": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "jinjor/elm-html-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5"
  ],
  "jinjor/elm-inline-hover": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jinjor/elm-insertable-key": [
    "1.0.0",
    "1.0.1"
  ],
  "jinjor/elm-map-debug": [
    "1.0.0",
    "1.1.0"
  ],
  "jinjor/elm-req": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0"
  ],
  "jinjor/elm-time-travel": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9",
    "1.0.10",
    "1.0.11",
    "1.0.12",
    "1.0.13",
    "1.0.14",
    "1.0.15",
    "1.0.16",
    "1.0.17",
    "2.0.0"
  ],
  "jinjor/elm-transition": [
    "1.0.0"
  ],
  "jinjor/elm-xml-parser": [
    "1.0.0",
    "2.0.0"
  ],
  "jirichmiel/minimax": [
    "1.0.0",
    "1.0.1"
  ],
  "jjagielka/select-menu": [
    "1.0.0",
    "1.0.1"
  ],
  "jjant/elm-comonad-zipper": [
    "1.0.0",
    "1.0.1"
  ],
  "jjant/elm-dict": [
    "1.0.0",
    "2.0.0"
  ],
  "jjant/elm-printf": [
    "1.0.0"
  ],
  "jluckyiv/elm-utc-date-strings": [
    "1.0.0"
  ],
  "jmg-duarte/group-list": [
    "1.0.0"
  ],
  "joakin/elm-canvas": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.2.0",
    "4.2.1"
  ],
  "joakin/elm-grid": [
    "1.0.0",
    "1.0.1"
  ],
  "joefiorini/elm-time-machine": [
    "1.0.0"
  ],
  "john-kelly/elm-interactive-graphics": [
    "1.0.0",
    "2.0.0"
  ],
  "john-kelly/elm-postgrest": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0"
  ],
  "john-kelly/elm-rest": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "johnathanbostrom/elm-dice": [
    "1.0.0",
    "2.0.0"
  ],
  "johnathanbostrom/selectlist": [
    "1.0.0"
  ],
  "johnathanbostrom/selectlist-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "johnpmayer/elm-linear-algebra": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "johnpmayer/elm-opaque": [
    "1.0.0"
  ],
  "johnpmayer/elm-webgl": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1"
  ],
  "johnpmayer/state": [
    "1.0.0"
  ],
  "johnpmayer/tagtree": [
    "1.0.0"
  ],
  "jonathanfishbein1/complex-numbers": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "6.1.1",
    "7.0.0",
    "7.0.1"
  ],
  "jonathanfishbein1/elm-comment": [
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.0.1",
    "3.0.1",
    "4.0.0",
    "1.0.0",
    "3.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.0.4",
    "5.0.5"
  ],
  "jonathanfishbein1/elm-equal": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jonathanfishbein1/elm-field": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0"
  ],
  "jonathanfishbein1/elm-monoid": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jonathanfishbein1/elm-semigroup": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jonathanfishbein1/linear-algebra": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "7.0.0",
    "7.1.0",
    "8.0.0",
    "9.0.0"
  ],
  "joneshf/elm-comonad": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "joneshf/elm-constraint": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "joneshf/elm-mom": [
    "1.0.0"
  ],
  "joneshf/elm-proxy": [
    "1.0.0"
  ],
  "joneshf/elm-tagged": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "joneshf/elm-tail-recursion": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "joneshf/elm-these": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.2.1"
  ],
  "jonoabroad/commatosed": [
    "1.0.0"
  ],
  "joonazan/elm-gol": [
    "1.0.0"
  ],
  "joonazan/elm-type-inference": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "2.0.1",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.1.1",
    "5.2.0"
  ],
  "jordymoos/pilf": [
    "1.0.0"
  ],
  "jorgengranseth/elm-string-format": [
    "1.0.0",
    "1.0.1"
  ],
  "joshforisha/elm-entities": [
    "1.0.0",
    "2.0.0"
  ],
  "joshforisha/elm-html-entities": [
    "1.0.0"
  ],
  "joshforisha/elm-inflect": [
    "1.0.0"
  ],
  "jouderianjr/elm-dialog": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jouderianjr/elm-loaders": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jpagex/elm-geoip": [
    "1.0.0"
  ],
  "jpagex/elm-loader": [
    "1.0.0"
  ],
  "jpagex/elm-material-color": [
    "1.0.0",
    "1.0.1"
  ],
  "jreut/elm-grid": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jsanchesleao/elm-assert": [
    "1.0.0",
    "1.0.1"
  ],
  "jschomay/elm-bounded-number": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "jschomay/elm-narrative-engine": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0"
  ],
  "jschomay/elm-paginate": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1"
  ],
  "jschonenberg/elm-dropdown": [
    "1.0.0",
    "1.0.1"
  ],
  "json-tools/json-schema": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "json-tools/json-value": [
    "1.0.0",
    "1.0.1"
  ],
  "jtanguy/moulin-rouge": [
    "1.0.0",
    "2.0.0"
  ],
  "jtojnar/elm-json-tape": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "juanedi/charty": [
    "1.0.0",
    "2.0.0"
  ],
  "justgage/tachyons-elm": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3"
  ],
  "justgook/alt-linear-algebra": [
    "1.0.0",
    "2.0.0"
  ],
  "justgook/elm-game-logic": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "justgook/elm-image": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0"
  ],
  "justgook/elm-image-encode": [
    "1.0.0"
  ],
  "justgook/elm-tiled": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "justgook/elm-tiled-decode": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "1.1.1",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "justgook/elm-webdriver": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "justgook/webgl-playground": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3"
  ],
  "justgook/webgl-shape": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "justinmimbs/date": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.2.0",
    "3.2.1"
  ],
  "justinmimbs/elm-arc-diagram": [
    "1.0.0"
  ],
  "justinmimbs/elm-date-extra": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "justinmimbs/elm-date-selector": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "justinmimbs/time-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "justinmimbs/timezone-data": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4",
    "3.0.0"
  ],
  "justinmimbs/tzif": [
    "1.0.0"
  ],
  "jvdvleuten/url-parser-combinator": [
    "1.0.0"
  ],
  "jvoigtlaender/elm-drag": [
    "1.0.0",
    "1.0.1"
  ],
  "jvoigtlaender/elm-gauss": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jvoigtlaender/elm-memo": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5"
  ],
  "jvoigtlaender/elm-warshall": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jweir/charter": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "jweir/elm-iso8601": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "6.0.1",
    "7.0.0"
  ],
  "jweir/sparkline": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "4.0.0"
  ],
  "jwheeler-cp/elm-form": [
    "1.0.0"
  ],
  "jwmerrill/elm-animation-frame": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "jwoudenberg/elm-test-experimental": [
    "1.0.0"
  ],
  "jwoudenberg/html-typed": [
    "1.0.0"
  ],
  "jxxcarlson/convolvemachine": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "jxxcarlson/elm-cell-grid": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.0.1"
  ],
  "jxxcarlson/elm-editor": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3"
  ],
  "jxxcarlson/elm-graph": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "jxxcarlson/elm-markdown": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8",
    "1.0.9",
    "1.0.10",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.2.3",
    "2.2.4",
    "2.3.0",
    "2.4.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.1.0",
    "5.0.0",
    "5.1.0",
    "5.1.1",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "9.1.0",
    "9.2.0",
    "9.2.1",
    "9.2.2",
    "9.2.3",
    "9.2.4",
    "9.2.5",
    "9.2.6",
    "9.2.7",
    "9.2.8",
    "9.2.9",
    "9.2.10",
    "9.2.11",
    "9.2.12",
    "9.2.13",
    "9.2.14",
    "9.2.15",
    "9.2.16"
  ],
  "jxxcarlson/elm-pseudorandom": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jxxcarlson/elm-stat": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3"
  ],
  "jxxcarlson/elm-tar": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5",
    "3.0.6",
    "3.0.7",
    "3.0.8",
    "3.0.9",
    "3.0.10",
    "3.0.11",
    "3.0.12",
    "4.0.0"
  ],
  "jxxcarlson/elm-text-editor": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.0.4",
    "7.0.5",
    "7.0.6",
    "7.0.7",
    "7.0.8"
  ],
  "jxxcarlson/elm-typed-time": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0"
  ],
  "jxxcarlson/elm-widget": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0"
  ],
  "jxxcarlson/geometry": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "jxxcarlson/graphdisplay": [
    "1.0.0"
  ],
  "jxxcarlson/hex": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "3.0.0",
    "4.0.0"
  ],
  "jxxcarlson/htree": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1"
  ],
  "jxxcarlson/math-markdown": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "2.0.7",
    "2.0.8",
    "2.0.9",
    "2.0.10",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5",
    "3.0.6"
  ],
  "jxxcarlson/meenylatex": [
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.1.0",
    "5.1.1",
    "5.1.2",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.0.4",
    "7.0.5",
    "7.0.6",
    "7.0.7",
    "7.0.8",
    "7.0.9",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "9.0.2",
    "9.1.0",
    "10.0.0",
    "10.0.1",
    "10.0.2",
    "10.0.3",
    "10.0.4",
    "10.0.5",
    "10.0.6",
    "10.0.7",
    "10.0.8",
    "11.0.0",
    "11.0.1",
    "11.0.2",
    "12.0.0",
    "12.0.1",
    "12.1.0",
    "13.0.0"
  ],
  "jxxcarlson/minilatex": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4",
    "2.1.5",
    "2.1.6",
    "2.1.7",
    "2.1.8",
    "2.1.9"
  ],
  "jxxcarlson/particle": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "jxxcarlson/tree-extra": [
    "1.0.0"
  ],
  "jystic/elm-font-awesome": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "jzxhuang/http-extras": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0"
  ],
  "kallaspriit/elm-basic-auth": [
    "1.0.0"
  ],
  "kalutheo/elm-snapshot-tests": [
    "1.0.0"
  ],
  "kalutheo/elm-ui-explorer": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "8.0.0"
  ],
  "karldray/elm-ref": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0"
  ],
  "kennib/elm-maps": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.2.1"
  ],
  "kennib/elm-swipe": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0"
  ],
  "kfish/glsl-pasta": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "kfish/quaternion": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "kintail/elm-publish-test": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "kintail/input-widget": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "kirchner/elm-selectize": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "2.0.7"
  ],
  "kirchner/form-validation": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "kkpoon/elm-auth0": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "kkpoon/elm-auth0-urlparser": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1"
  ],
  "kkpoon/elm-echarts": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "10.0.0",
    "10.0.1"
  ],
  "klaftertief/elm-heatmap": [
    "1.0.0"
  ],
  "klazuka/elm-json-tree-view": [
    "1.0.0",
    "2.0.0",
    "2.1.0"
  ],
  "kmbn/elm-hotkeys": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "knewter/elm-rfc5988-parser": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "knledg/touch-events": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "korutx/elm-rut": [
    "1.0.0",
    "1.0.1"
  ],
  "koskoci/elm-sortable-table": [
    "1.0.0",
    "1.0.1"
  ],
  "koyachi/elm-sha": [
    "1.0.0"
  ],
  "kress95/random-pcg-extra": [
    "1.0.0",
    "1.0.1"
  ],
  "krisajenkins/elm-astar": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3"
  ],
  "krisajenkins/elm-cdn": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "2.0.0"
  ],
  "krisajenkins/elm-dialog": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3"
  ],
  "krisajenkins/elm-exts": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.2.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "8.3.0",
    "8.4.0",
    "9.0.0",
    "9.1.0",
    "9.2.0",
    "9.3.0",
    "9.4.0",
    "10.0.0",
    "10.1.0",
    "10.2.0",
    "10.2.1",
    "10.2.2",
    "10.2.3",
    "10.2.4",
    "10.2.5",
    "10.2.6",
    "10.3.0",
    "10.3.1",
    "10.3.2",
    "10.3.3",
    "10.4.0",
    "10.4.1",
    "10.5.0",
    "10.6.0",
    "10.7.0",
    "10.8.0",
    "11.0.0",
    "12.0.0",
    "12.1.0",
    "12.2.0",
    "12.3.0",
    "12.3.1",
    "12.4.0",
    "12.5.0",
    "12.6.0",
    "12.7.0",
    "12.8.0",
    "12.9.0",
    "12.10.0",
    "12.11.0",
    "13.0.0",
    "14.0.0",
    "14.0.1",
    "15.0.0",
    "15.0.1",
    "16.0.0",
    "17.0.0",
    "17.1.0",
    "17.1.1",
    "18.0.0",
    "18.1.0",
    "18.1.1",
    "19.0.0",
    "19.1.0",
    "19.2.0",
    "19.3.0",
    "19.4.0",
    "20.0.0",
    "21.0.0",
    "22.0.0",
    "23.0.0",
    "23.1.0",
    "23.2.0",
    "23.2.1",
    "23.3.0",
    "24.0.0",
    "24.1.0",
    "24.2.0",
    "24.3.0",
    "25.0.0",
    "25.0.1",
    "25.1.0",
    "25.2.0",
    "25.3.0",
    "25.4.0",
    "25.5.0",
    "25.6.0",
    "25.6.1",
    "25.6.2",
    "25.7.0",
    "25.8.0",
    "25.8.1",
    "25.9.0",
    "25.10.0",
    "25.11.0",
    "25.12.0",
    "25.13.0",
    "26.0.0",
    "26.1.0",
    "26.1.1",
    "26.2.0",
    "26.3.0",
    "26.4.0",
    "26.5.0",
    "27.0.0",
    "27.1.0",
    "27.2.0",
    "27.3.0",
    "27.4.0",
    "28.0.0"
  ],
  "krisajenkins/formatting": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.4.1",
    "2.5.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.2.0",
    "3.3.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "4.0.6",
    "4.0.7",
    "4.1.0",
    "4.2.0"
  ],
  "krisajenkins/history": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "krisajenkins/remotedata": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "2.4.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.2.0",
    "4.2.1",
    "4.3.0",
    "4.3.1",
    "4.3.2",
    "4.3.3",
    "4.4.0",
    "4.5.0",
    "5.0.0",
    "6.0.0",
    "6.0.1"
  ],
  "ktonon/elm-aws-core": [
    "1.0.0",
    "1.1.0"
  ],
  "ktonon/elm-child-update": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ktonon/elm-crypto": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "ktonon/elm-hmac": [
    "1.0.0",
    "1.0.1"
  ],
  "ktonon/elm-jsonwebtoken": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "ktonon/elm-memo-pure": [
    "1.0.0"
  ],
  "ktonon/elm-serverless": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1"
  ],
  "ktonon/elm-serverless-auth-jwt": [
    "1.0.0"
  ],
  "ktonon/elm-serverless-cors": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0"
  ],
  "ktonon/elm-test-extra": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.6.0",
    "1.6.1",
    "1.6.2",
    "2.0.0",
    "2.0.1"
  ],
  "ktonon/elm-word": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2"
  ],
  "kuon/elm-hsluv": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "kuon/elm-string-normalize": [
    "1.0.0",
    "1.0.1"
  ],
  "kuzminadya/mogeefont": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1"
  ],
  "kuzzmi/elm-gravatar": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "kyasu1/elm-ulid": [
    "1.0.0"
  ],
  "labzero/elm-google-geocoding": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0"
  ],
  "larribas/elm-image-slider": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "larribas/elm-multi-email-input": [
    "1.0.0"
  ],
  "larribas/elm-multi-input": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "laserpants/elm-burrito-update": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.3.1",
    "2.3.2",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "laserpants/elm-update-pipeline": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.3.2"
  ],
  "laszlopandy/elm-console": [
    "1.0.1",
    "1.0.0",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1"
  ],
  "lattenwald/elm-base64": [
    "1.0.1",
    "1.0.0",
    "1.0.2",
    "1.0.3"
  ],
  "lattyware/elm-fontawesome": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.3.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "4.0.0"
  ],
  "lattyware/elm-json-diff": [
    "1.0.0"
  ],
  "layer6ai/elm-filter-box": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "layer6ai/elm-query-builder": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "layflags/elm-bic": [
    "1.0.0",
    "2.0.0"
  ],
  "lazamar/dict-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "league/difference-list": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "league/unique-id": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "leojpod/review-no-empty-html-text": [
    "1.0.0"
  ],
  "leonardanyer/elm-combox": [
    "1.0.0"
  ],
  "lettenj61/elm-reusable-html": [
    "1.0.0",
    "2.0.0"
  ],
  "lgastako/elm-select": [
    "1.0.0",
    "2.0.0",
    "2.1.0"
  ],
  "liamcurry/elm-media": [
    "1.0.0"
  ],
  "linuss/smooth-scroll": [
    "1.0.0",
    "1.1.0"
  ],
  "lionar/select": [
    "1.0.0"
  ],
  "ljuglaret/combinatoire": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "ljuglaret/fraction": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "lorenzo/elm-string-addons": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "lorenzo/elm-tree-diagram": [
    "1.0.0"
  ],
  "lovasoa/choices": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3",
    "3.1.4",
    "3.1.5",
    "3.1.6"
  ],
  "lovasoa/elm-component-list": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "lovasoa/elm-csv": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "1.1.7"
  ],
  "lovasoa/elm-format-number": [
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "lovasoa/elm-jsonpseudolist": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "lovasoa/elm-median": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "lovasoa/elm-nested-list": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "lovasoa/elm-rolling-list": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4"
  ],
  "lucamug/elm-style-framework": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "7.0.2"
  ],
  "lucamug/elm-styleguide-generator": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1"
  ],
  "lucamug/style-framework": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "lucasssm/simpledate": [
    "1.0.0",
    "2.0.0"
  ],
  "ludvigsen/elm-svg-ast": [
    "1.0.0"
  ],
  "luftzig/elm-quadtree": [
    "1.0.1",
    "1.0.0"
  ],
  "lukewestby/accessible-html-with-css-temp-19": [
    "1.0.0"
  ],
  "lukewestby/elm-http-builder": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.2.0",
    "6.0.0",
    "7.0.0",
    "7.0.1"
  ],
  "lukewestby/elm-http-extra": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "5.2.0"
  ],
  "lukewestby/elm-i18n": [
    "1.0.0"
  ],
  "lukewestby/elm-string-interpolate": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "lukewestby/elm-template": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0"
  ],
  "lukewestby/http-extra": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "lukewestby/lru-cache": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "lukewestby/package-info": [
    "1.0.0"
  ],
  "lukewestby/worker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "lxierita/no-typealias-constructor-call": [
    "1.0.0",
    "1.0.1"
  ],
  "lynn/elm-arithmetic": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0"
  ],
  "lynn/elm-ordinal": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "lzrski/elm-polymer": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7"
  ],
  "m-mullins/elm-console": [
    "1.0.0",
    "1.0.1"
  ],
  "m00qek/elm-applicative": [
    "1.0.0"
  ],
  "m00qek/elm-cpf": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0"
  ],
  "maca/crdt-replicated-graph": [
    "1.0.0"
  ],
  "maca/crdt-replicated-tree": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "5.0.0"
  ],
  "maksar/elm-function-extra": [
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "maksar/elm-workflow": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "malaire/elm-safe-int": [
    "1.0.0"
  ],
  "malaire/elm-uint64": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "malinoff/elm-jwt": [
    "1.0.0"
  ],
  "malinoff/elm-uniform": [
    "1.0.0",
    "2.0.0"
  ],
  "maorleger/elm-flash": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "maorleger/elm-infinite-zipper": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "marcosccm/elm-datepicker": [
    "1.0.0"
  ],
  "marcosh/elm-html-to-unicode": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "marshallformula/arrangeable-list": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "marshallformula/elm-swiper": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "martin-volf/elm-jsonrpc": [
    "1.0.0"
  ],
  "martinos/elm-sortable-table": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "martinsk/elm-datastructures": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "massung/elm-css": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "matheus23/elm-drag-and-drop": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0"
  ],
  "matheus23/elm-figma-api": [
    "1.0.0"
  ],
  "matheus23/elm-markdown-transforms": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "matheus23/please-focus-more": [
    "1.0.0"
  ],
  "matthewrankin/elm-mdl": [
    "1.0.0"
  ],
  "matthewsj/elm-ordering": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "mattjbray/elm-prismicio": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0"
  ],
  "mattrrichard/elm-disjoint-set": [
    "1.0.0",
    "1.0.1"
  ],
  "maximoleinyk/elm-parser-utils": [
    "1.0.0",
    "1.1.0"
  ],
  "maxsnew/lazy": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "mbr/elm-extras": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0"
  ],
  "mbr/elm-mouse-events": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "mbylstra/elm-html-helpers": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "mc706/elm-clarity-ui": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.5.1",
    "1.5.2",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.3.0",
    "2.4.0",
    "2.5.0",
    "2.6.0",
    "2.7.0",
    "2.7.1",
    "2.8.0",
    "2.8.1"
  ],
  "mcordova47/elm-natural-ordering": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "mdgriffith/elm-animation-pack": [
    "1.0.0"
  ],
  "mdgriffith/elm-animator": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1"
  ],
  "mdgriffith/elm-color-mixing": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1"
  ],
  "mdgriffith/elm-debug-watch": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "mdgriffith/elm-html-animation": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "mdgriffith/elm-markup": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.0.6",
    "3.0.0",
    "3.0.1"
  ],
  "mdgriffith/elm-style-animation": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0",
    "3.4.0",
    "3.5.0",
    "3.5.1",
    "3.5.2",
    "3.5.3",
    "3.5.4",
    "3.5.5",
    "4.0.0"
  ],
  "mdgriffith/elm-style-animation-zero-sixteen": [
    "1.0.0",
    "1.0.1"
  ],
  "mdgriffith/elm-ui": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "1.1.7"
  ],
  "mdgriffith/style-elements": [
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.2.2",
    "3.2.3",
    "3.3.0",
    "3.4.0",
    "3.4.1",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.2.1",
    "4.3.0",
    "5.0.0",
    "5.0.1"
  ],
  "mdgriffith/stylish-elephants": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "7.0.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.1.0"
  ],
  "melon-love/elm-gab-api": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.0.1",
    "9.0.0",
    "10.0.0",
    "11.0.0"
  ],
  "mercurymedia/elm-datetime-picker": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "mercurymedia/elm-message-toast": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0"
  ],
  "mercurymedia/elm-smart-select": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "mgold/elm-animation": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0"
  ],
  "mgold/elm-date-format": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "1.1.7",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.4.2",
    "1.5.0",
    "1.6.0",
    "1.7.0",
    "1.8.0"
  ],
  "mgold/elm-geojson": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "mgold/elm-join": [
    "1.0.0"
  ],
  "mgold/elm-nonempty-list": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.7.0",
    "1.7.1",
    "1.8.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0"
  ],
  "mgold/elm-random-pcg": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "4.0.2",
    "5.0.0",
    "5.0.1",
    "5.0.2"
  ],
  "mgold/elm-random-sample": [
    "1.0.0"
  ],
  "mgold/elm-socketio": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "mgold/elm-turtle-graphics": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "mgree/trampoline": [
    "1.0.0"
  ],
  "mhoare/elm-stack": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "3.1.1",
    "3.1.2"
  ],
  "miaEngiadina/elm-ghost": [
    "1.0.0",
    "2.0.0"
  ],
  "micktwomey/elmo-8": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "mikaxyz/elm-cropper": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "milesrock/elm-creditcard": [
    "1.0.0"
  ],
  "miniBill/date-format-languages": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "miniBill/elm-avataaars": [
    "1.0.0"
  ],
  "miniBill/elm-codec": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0"
  ],
  "miyamoen/bibliopola": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "miyamoen/elm-command-pallet": [
    "1.0.0"
  ],
  "miyamoen/elm-todofuken": [
    "1.0.0",
    "1.0.1"
  ],
  "miyamoen/select-list": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "miyamoen/tree-with-zipper": [
    "1.0.0"
  ],
  "mkovacs/quaternion": [
    "1.0.0"
  ],
  "mmetcalfe/elm-random-distributions": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0"
  ],
  "monty5811/elm-bible": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "monty5811/remote-list": [
    "1.0.0",
    "1.0.1"
  ],
  "mpdairy/elm-component-updater": [
    "1.0.0",
    "1.0.1"
  ],
  "mpizenberg/elm-debounce": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "mpizenberg/elm-image-annotation": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.1.4",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "6.0.0",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "8.0.0",
    "8.0.1",
    "8.1.0",
    "8.2.0"
  ],
  "mpizenberg/elm-image-collection": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "2.3.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2"
  ],
  "mpizenberg/elm-mouse-compat": [
    "1.0.0",
    "2.0.0"
  ],
  "mpizenberg/elm-mouse-events": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0"
  ],
  "mpizenberg/elm-pointer-events": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.0.2"
  ],
  "mpizenberg/elm-touch-events": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "mrdimosthenis/turtle-graphics": [
    "1.0.0",
    "1.0.1"
  ],
  "mrpinsky/elm-keyed-list": [
    "1.0.0",
    "1.1.0"
  ],
  "mrvicadai/elm-palette": [
    "1.0.0"
  ],
  "mrvicadai/elm-stats": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "mthadley/elm-byte": [
    "1.0.0",
    "1.0.1"
  ],
  "mthadley/elm-hash-routing": [
    "1.0.0",
    "1.0.1"
  ],
  "mthadley/elm-typewriter": [
    "1.0.0",
    "1.0.1"
  ],
  "mtonnberg/refinement-proofs": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1"
  ],
  "mukeshsoni/elm-rope": [
    "1.0.0"
  ],
  "mulander/diceware": [
    "1.0.0",
    "1.0.1"
  ],
  "munksgaard/char-extra": [
    "1.0.0"
  ],
  "munksgaard/elm-charts": [
    "1.0.0"
  ],
  "munksgaard/elm-data-uri": [
    "1.0.0",
    "1.0.1"
  ],
  "munksgaard/elm-media-type": [
    "1.0.0",
    "1.1.0"
  ],
  "mweiss/elm-rte-toolkit": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "mxgrn/elm-phoenix-socket": [
    "1.0.0"
  ],
  "myrho/dive": [
    "1.0.0",
    "1.0.1"
  ],
  "myrho/elm-round": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "myrho/elm-statistics": [
    "1.0.0"
  ],
  "naddeoa/elm-simple-bootstrap": [
    "1.0.0",
    "1.1.0"
  ],
  "naddeoa/quick-cache": [
    "1.0.0"
  ],
  "naddeoa/stream": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "2.3.0",
    "2.4.0"
  ],
  "nathanfox/elm-string-format": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "nathanjohnson320/base58": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "nathanjohnson320/coinmarketcap-elm": [
    "1.0.0"
  ],
  "nathanjohnson320/ecurve": [
    "1.0.0"
  ],
  "nathanjohnson320/elm-ui-components": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.3.0"
  ],
  "nathanjohnson320/elmark": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "ndortega/elm-gtranslate": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "nedSaf/elm-bootstrap-grid": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "neurodynamic/elm-parse-html": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "2.0.0"
  ],
  "newlandsvalley/elm-abc-parser": [
    "1.0.0",
    "1.1.0"
  ],
  "newlandsvalley/elm-binary-base64": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "newlandsvalley/elm-comidi": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0",
    "3.0.0"
  ],
  "newmana/chroma-elm": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.2.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "5.0.0",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.1.0",
    "9.0.0",
    "10.0.0",
    "10.0.1",
    "10.1.0",
    "10.1.1",
    "11.0.0",
    "11.0.1",
    "11.0.2",
    "12.0.0",
    "12.1.0",
    "12.1.1",
    "12.1.2",
    "13.0.0",
    "13.1.0",
    "13.1.1",
    "13.2.0",
    "13.3.0",
    "14.0.0",
    "15.0.0",
    "16.0.0",
    "16.0.1",
    "16.0.2",
    "16.0.3",
    "16.0.4",
    "17.0.0",
    "17.1.0",
    "17.1.1",
    "17.2.0",
    "18.0.0"
  ],
  "nicmr/compgeo": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "niho/json-schema-form": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "niho/personal-number": [
    "1.0.0"
  ],
  "nik-garmash/elm-test": [
    "1.0.0"
  ],
  "nikita-volkov/hashing-containers": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0"
  ],
  "nikita-volkov/typeclasses": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.5.0",
    "1.6.0",
    "1.6.1",
    "1.7.0",
    "1.8.0"
  ],
  "nishiurahiroki/elm-simple-pagenate": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "nkotzias/elm-jsonp": [
    "1.0.0"
  ],
  "noahzgordon/elm-color-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "noahzgordon/elm-jsonapi": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.0.1"
  ],
  "noahzgordon/elm-jsonapi-http": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "nonpop/elm-purl": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.0.1"
  ],
  "noredink/elm-rollbar": [
    "1.0.0"
  ],
  "noredink/string-conversions": [
    "1.0.0"
  ],
  "norpan/elm-file-reader": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1"
  ],
  "norpan/elm-html5-drag-drop": [
    "1.0.0",
    "1.0.1",
    "1.0.3",
    "1.0.2",
    "1.0.4",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3",
    "3.1.4"
  ],
  "norpan/elm-json-patch": [
    "1.0.0",
    "1.0.1"
  ],
  "not1602/elm-feather": [
    "1.0.0"
  ],
  "nphollon/collision": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "nphollon/collisions": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "nphollon/geo3d": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.1.0",
    "2.1.1"
  ],
  "nphollon/interpolate": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "nphollon/mechanics": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0"
  ],
  "nphollon/update-clock": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.1.0"
  ],
  "oaalto/time-values": [
    "1.0.0",
    "2.0.0"
  ],
  "ohanhi/autoexpand": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "ohanhi/elm-web-data": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "ohanhi/keyboard": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1"
  ],
  "ohanhi/keyboard-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4"
  ],
  "ohanhi/lorem": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ohanhi/remotedata-http": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "4.0.0"
  ],
  "oleiade/elm-maestro": [
    "1.0.0"
  ],
  "ondras/elm-irc": [
    "1.0.0",
    "1.0.1"
  ],
  "opensolid/geometry": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.0.1"
  ],
  "opensolid/linear-algebra": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "opensolid/linear-algebra-interop": [
    "1.0.0",
    "2.0.0"
  ],
  "opensolid/mesh": [
    "1.0.0",
    "1.0.1"
  ],
  "opensolid/svg": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "opensolid/webgl-math": [
    "1.0.0",
    "1.0.1"
  ],
  "opensolid/webgl-math-interop": [
    "1.0.0"
  ],
  "opvasger/amr": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "3.1.1"
  ],
  "orus-io/elm-openid-connect": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "overminddl1/program-ex": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "owanturist/elm-avl-dict": [
    "1.0.0",
    "2.0.0",
    "2.1.0"
  ],
  "owanturist/elm-bulletproof": [
    "1.0.0"
  ],
  "owanturist/elm-graphql": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "5.0.0"
  ],
  "owanturist/elm-queue": [
    "1.0.0",
    "2.0.0"
  ],
  "owanturist/elm-union-find": [
    "1.0.0"
  ],
  "owanturist/elm-validation": [
    "1.0.0"
  ],
  "ozmat/elm-forms": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1"
  ],
  "ozmat/elm-validation": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1"
  ],
  "ozyinc/elm-sortable-table-with-row-id": [
    "1.0.0"
  ],
  "pablen/toasty": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "1.2.0"
  ],
  "pablohirafuji/elm-char-codepoint": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "pablohirafuji/elm-markdown": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5"
  ],
  "pablohirafuji/elm-qrcode": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0",
    "3.3.1"
  ],
  "pablohirafuji/elm-syntax-highlight": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0"
  ],
  "panthershark/email-parser": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "panthershark/snackbar": [
    "1.0.0"
  ],
  "paramanders/elm-hexagon": [
    "1.0.0",
    "2.0.0"
  ],
  "pascallemerrer/elm-advanced-grid": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "passiomatic/elm-figma-api": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "pastelInc/elm-validator": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "patrickjtoy/elm-table": [
    "1.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.1.0"
  ],
  "paul-freeman/elm-ipfs": [
    "1.0.0"
  ],
  "paulcorke/elm-number-format": [
    "1.0.0"
  ],
  "paulcorke/elm-string-split": [
    "1.0.0"
  ],
  "pd-andy/elm-audio-graph": [
    "1.0.0",
    "1.0.1"
  ],
  "pd-andy/elm-limiter": [
    "1.0.0"
  ],
  "pd-andy/elm-web-audio": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "pd-andy/tuple-extra": [
    "1.0.0",
    "1.0.1"
  ],
  "pdamoc/elm-css": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "3.0.2"
  ],
  "pdamoc/elm-hashids": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "pdamoc/elm-ports-driver": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "pehota/elm-zondicons": [
    "1.0.0",
    "1.0.1"
  ],
  "periodic/elm-csv": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1"
  ],
  "perzanko/elm-loading": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "peterszerzo/elm-arborist": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.3.0",
    "2.3.1",
    "2.4.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "6.1.0",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.1.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.0.3",
    "8.0.4",
    "8.0.5",
    "8.1.0",
    "8.1.1",
    "8.1.2",
    "8.1.3",
    "8.2.0",
    "8.3.0",
    "8.4.0",
    "8.5.0"
  ],
  "peterszerzo/elm-cms": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "peterszerzo/elm-gameroom": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "peterszerzo/elm-json-tree-view": [
    "1.0.0"
  ],
  "peterszerzo/elm-natural-ui": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "3.3.1",
    "3.3.2",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "4.4.0",
    "4.4.1",
    "4.4.2",
    "4.5.0",
    "4.5.1",
    "4.6.0",
    "4.7.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "8.3.0",
    "8.3.1",
    "9.0.0",
    "9.1.0",
    "9.1.1",
    "10.0.0",
    "10.1.0",
    "10.1.1",
    "10.2.0",
    "10.2.1",
    "10.2.2",
    "10.3.0",
    "11.0.0",
    "11.0.1",
    "11.1.0",
    "11.2.0",
    "12.0.0",
    "12.0.1",
    "13.0.0",
    "13.0.1",
    "13.1.0",
    "13.2.0",
    "13.2.1",
    "13.3.0",
    "13.4.0",
    "13.5.0",
    "13.5.1",
    "13.5.2",
    "13.5.3",
    "13.5.4",
    "13.5.5",
    "13.5.6",
    "13.5.7",
    "14.0.0",
    "15.0.0",
    "15.0.1",
    "15.1.0",
    "15.2.0",
    "15.2.1",
    "15.2.2",
    "16.0.0"
  ],
  "peterszerzo/elm-porter": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0"
  ],
  "peterszerzo/line-charts": [
    "1.0.0",
    "1.0.1"
  ],
  "pfcoperez/elm-playground": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "phollyer/elm-phoenix-websocket": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0"
  ],
  "phollyer/elm-ui-colors": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "pietro909/elm-sticky-header": [
    "1.0.0",
    "2.0.0"
  ],
  "pilatch/elm-chess": [
    "1.0.0"
  ],
  "pilatch/flip": [
    "1.0.0"
  ],
  "pinx/elm-mdl": [
    "1.0.0"
  ],
  "piotrdubiel/elm-art-in-pi": [
    "1.0.0"
  ],
  "powet/elm-funfolding": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "poying/elm-router": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "poying/elm-style": [
    "1.0.0"
  ],
  "prikhi/bootstrap-gallery": [
    "1.0.0",
    "1.0.1"
  ],
  "prikhi/decimal": [
    "1.0.0",
    "2.0.0"
  ],
  "prikhi/elm-http-builder": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0"
  ],
  "prikhi/http-tasks": [
    "1.0.0"
  ],
  "prikhi/paginate": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.1.0"
  ],
  "prikhi/remote-status": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "primait/elm-autocomplete": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0"
  ],
  "primait/elm-form": [
    "2.0.0",
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.0.3",
    "8.0.4",
    "9.0.0",
    "10.0.0",
    "11.0.0",
    "12.0.0",
    "12.0.1",
    "12.0.2",
    "12.0.3",
    "13.0.0",
    "13.1.0",
    "13.1.1",
    "13.2.0",
    "13.2.1",
    "13.2.2",
    "13.2.3",
    "13.2.4",
    "13.2.6",
    "13.2.7"
  ],
  "primait/forms": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "primait/pyxis-components": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0",
    "3.3.1",
    "3.3.2",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "5.0.0",
    "6.0.0"
  ],
  "pristap/smart-text": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6"
  ],
  "pro100filipp/elm-graphql": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "3.0.0",
    "3.1.0"
  ],
  "proda-ai/elm-dropzone": [
    "1.0.0",
    "1.0.1"
  ],
  "proda-ai/elm-logger": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "proda-ai/elm-svg-loader": [
    "1.0.0",
    "1.0.1"
  ],
  "proda-ai/formatting": [
    "1.0.0"
  ],
  "project-fuzzball/node": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "project-fuzzball/test": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.0.4",
    "6.0.0"
  ],
  "project-fuzzball/test-runner": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "prozacchiwawa/effmodel": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "prozacchiwawa/elm-json-codec": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.3.0",
    "3.3.1"
  ],
  "prozacchiwawa/elm-keccak": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0"
  ],
  "prozacchiwawa/elm-urlbase64": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "publeaks/elm-rivescript": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "pukkamustard/elm-identicon": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "purohit/style-elements": [
    "1.0.0"
  ],
  "pwentz/elm-pretty-printer": [
    "2.0.0",
    "3.0.0"
  ],
  "pzingg/elm-navigation-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "pzp1997/assoc-list": [
    "1.0.0"
  ],
  "r-k-b/complex": [
    "1.0.0"
  ],
  "r-k-b/elm-interval": [
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "r-k-b/map-accumulate": [
    "1.0.0",
    "1.0.1"
  ],
  "r-k-b/no-float-ids": [
    "1.0.0"
  ],
  "r-k-b/no-long-import-lines": [
    "1.0.0",
    "1.0.1"
  ],
  "rainteller/elm-capitalize": [
    "1.0.0",
    "1.0.1"
  ],
  "rajasharan/elm-automatic-differentiation": [
    "1.0.0"
  ],
  "rametta/elm-datetime-picker": [
    "1.0.0",
    "2.0.0"
  ],
  "realyarilabs/yarimoji": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "rehno-lindeque/elm-signal-alt": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "reiner-dolp/elm-natural-ordering": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "relabsoss/elm-date-extra": [
    "1.0.0"
  ],
  "remoteradio/elm-widgets": [
    "1.0.0",
    "1.0.1"
  ],
  "renanpvaz/elm-bem": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "reserve-protocol/elm-i3166-data": [
    "1.0.0"
  ],
  "reserve-protocol/elm-iso3166-data": [
    "1.0.0",
    "1.0.1"
  ],
  "rgrempel/elm-http-decorators": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0"
  ],
  "rgrempel/elm-route-url": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0"
  ],
  "rhofour/elm-astar": [
    "1.0.0"
  ],
  "rhofour/elm-pairing-heap": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "rielas/measurement": [
    "1.0.0"
  ],
  "ringvold/elm-iso8601-date-strings": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "rix501/elm-sortable-table": [
    "1.0.0"
  ],
  "rizafahmi/elm-semantic-ui": [
    "1.0.0"
  ],
  "rjbma/elm-listview": [
    "1.0.0"
  ],
  "rjbma/elm-modal": [
    "1.0.0"
  ],
  "rjdestigter/elm-convert-units": [
    "1.0.0"
  ],
  "rkrupinski/elm-range-slider": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "rl-king/elm-gallery": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "rl-king/elm-inview": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "2.0.0"
  ],
  "rl-king/elm-iso3166-country-codes": [
    "1.0.0",
    "2.0.0"
  ],
  "rl-king/elm-masonry": [
    "1.0.0"
  ],
  "rl-king/elm-modular-scale": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "rl-king/elm-scroll-to": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "rluiten/elm-date-extra": [
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "7.2.1",
    "8.0.0",
    "8.1.0",
    "8.1.1",
    "8.1.2",
    "8.2.0",
    "8.3.0",
    "8.4.0",
    "8.5.0",
    "8.5.1",
    "8.6.0",
    "8.6.1",
    "8.6.2",
    "8.7.0",
    "9.0.0",
    "9.0.1",
    "9.1.0",
    "9.1.1",
    "9.1.2",
    "9.2.0",
    "9.2.1",
    "9.2.2",
    "9.2.3",
    "9.3.0",
    "9.3.1",
    "9.4.0"
  ],
  "rluiten/elm-text-search": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "5.0.0",
    "5.0.1"
  ],
  "rluiten/mailcheck": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "4.1.4",
    "5.0.0",
    "5.0.1",
    "5.0.2"
  ],
  "rluiten/sparsevector": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "rluiten/stemmer": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "rluiten/stringdistance": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "rluiten/trie": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "rnons/elm-svg-loader": [
    "1.0.0"
  ],
  "rnons/elm-svg-parser": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "rnons/ordered-containers": [
    "1.0.0"
  ],
  "roSievers/font-awesome": [
    "1.0.0",
    "1.0.1"
  ],
  "robertjlooby/elm-draggable-form": [
    "1.0.0",
    "1.0.1"
  ],
  "robertjlooby/elm-generic-dict": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "robinpokorny/elm-brainfuck": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "robotmay/s3-direct-file-upload": [
    "1.0.0"
  ],
  "robwhitaker/elm-infinite-stream": [
    "1.0.0"
  ],
  "robwhitaker/elm-uuid-stream": [
    "1.0.0",
    "2.0.0"
  ],
  "robx/elm-edn": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.3.0"
  ],
  "rodinalex/elm-cron": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "rogeriochaves/elm-ternary": [
    "1.0.0",
    "1.0.1"
  ],
  "rogeriochaves/elm-test-bdd-style": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.0.3",
    "6.1.0",
    "6.1.1",
    "6.1.2"
  ],
  "rogeriochaves/elm-testable": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "rogeriochaves/elm-testable-css-helpers": [
    "1.0.0",
    "1.0.1"
  ],
  "roine/elm-perimeter": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "rolograaf/elm-favicon": [
    "1.0.0"
  ],
  "romariolopezc/elm-hmac-sha1": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "romariolopezc/elm-sentry": [
    "1.0.0"
  ],
  "romstad/elm-chess": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "ronanyeah/calendar-dates": [
    "1.0.0"
  ],
  "ronanyeah/helpers": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0"
  ],
  "rsignavong/elm-cloudinary-video-player": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "rsignavong/elm-leaflet-map": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0"
  ],
  "rtfeldman/console-print": [
    "1.0.0"
  ],
  "rtfeldman/count": [
    "1.0.0",
    "1.0.1"
  ],
  "rtfeldman/elm-css": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.2.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "5.0.0",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "8.0.0",
    "8.1.0",
    "8.2.0",
    "9.0.0",
    "9.1.0",
    "10.0.0",
    "11.0.0",
    "11.1.0",
    "11.2.0",
    "12.0.0",
    "12.0.1",
    "13.0.0",
    "13.0.1",
    "13.1.0",
    "13.1.1",
    "14.0.0",
    "15.0.0",
    "15.1.0",
    "16.0.0",
    "16.0.1"
  ],
  "rtfeldman/elm-css-helpers": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.1.0"
  ],
  "rtfeldman/elm-css-util": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "rtfeldman/elm-hex": [
    "1.0.0"
  ],
  "rtfeldman/elm-iso8601-date-strings": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "rtfeldman/elm-sorter-experiment": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "rtfeldman/elm-validate": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1"
  ],
  "rtfeldman/hashed-class": [
    "1.0.0"
  ],
  "rtfeldman/hex": [
    "1.0.0"
  ],
  "rtfeldman/html-test-runner": [
    "1.0.0",
    "2.0.0"
  ],
  "rtfeldman/legacy-elm-test": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "rtfeldman/node-test-runner": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "rtfeldman/selectlist": [
    "1.0.0"
  ],
  "rtfeldman/test-update": [
    "1.0.0"
  ],
  "rtfeldman/ziplist": [
    "1.0.0",
    "2.0.0"
  ],
  "rundis/elm-bootstrap": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.1.0",
    "5.2.0"
  ],
  "russelldavies/elm-range": [
    "1.0.0"
  ],
  "ryan-senn/elm-compiler-error-sscce": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0",
    "5.1.0",
    "6.0.0"
  ],
  "ryan-senn/elm-google-domains": [
    "1.0.0"
  ],
  "ryan-senn/elm-readability": [
    "1.0.0",
    "1.1.0"
  ],
  "ryan-senn/elm-tlds": [
    "1.0.0"
  ],
  "ryan-senn/stellar-elm-sdk": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "ryannhg/date-format": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "ryannhg/elm-date-format": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.1.1"
  ],
  "ryannhg/elm-moment": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ryannhg/elm-spa": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "ryanolsonx/elm-mock-http": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "ryanolsonx/elm-time-range": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ryota0624/date-controll": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "ryry0/elm-numeric": [
    "1.0.0"
  ],
  "s3k/latte-charts": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "s6o/elm-recase": [
    "1.0.0",
    "1.0.1"
  ],
  "s6o/elm-simplify": [
    "1.0.0"
  ],
  "samhstn/time-format": [
    "1.0.0"
  ],
  "samueldple/material-color": [
    "1.0.0",
    "1.0.1"
  ],
  "samuelstevens/elm-csv": [
    "1.0.0",
    "1.0.1"
  ],
  "sanichi/elm-md5": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "1.0.7",
    "1.0.8"
  ],
  "sashaafm/eetf": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "savardd/elm-time-travel": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "sawaken-experiment/elm-lisp-parser": [
    "1.0.0"
  ],
  "sch/elm-aspect-ratio": [
    "1.0.0"
  ],
  "scottcorgan/elm-css-normalize": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "1.1.7",
    "1.1.8",
    "1.1.9"
  ],
  "scottcorgan/elm-css-reset": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "scottcorgan/elm-html-template": [
    "1.0.0",
    "1.0.1"
  ],
  "scottcorgan/elm-keyboard-combo": [
    "1.0.0"
  ],
  "scottcorgan/keyboard-combo": [
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "4.0.0",
    "5.0.0"
  ],
  "seanhess/elm-style": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "seanpile/elm-orbit-controls": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "seanpoulter/elm-versioning-spike": [
    "1.0.0",
    "1.0.1"
  ],
  "seurimas/slime": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "sgraf812/elm-access": [
    "1.0.0"
  ],
  "sgraf812/elm-graph": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "sgraf812/elm-intdict": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.4.2",
    "1.4.3"
  ],
  "sgraf812/elm-stateful": [
    "1.0.0"
  ],
  "sh4r3m4n/elm-piano": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3"
  ],
  "shelakel/elm-validate": [
    "1.0.0"
  ],
  "shmookey/cmd-extra": [
    "1.0.0"
  ],
  "showell/binary-tree-diagram": [
    "1.0.0",
    "1.0.1"
  ],
  "showell/dict-dot-dot": [
    "1.0.0",
    "1.0.1"
  ],
  "showell/elm-data-util": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0"
  ],
  "showell/meta-elm": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.1.0"
  ],
  "shutej/elm-rpcplus-runtime": [
    "1.0.0",
    "1.0.1"
  ],
  "simanaitis/elm-mdl": [
    "2.0.0",
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.2.0"
  ],
  "simonewebdesign/elm-timer": [
    "1.0.0"
  ],
  "simonh1000/elm-charts": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.1.0"
  ],
  "simonh1000/elm-colorpicker": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.1.4",
    "1.1.5",
    "1.1.6",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "simonh1000/elm-jwt": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "5.0.0",
    "5.1.0",
    "5.2.0",
    "5.2.1",
    "5.2.2",
    "5.3.0",
    "6.0.0",
    "7.0.0",
    "7.1.0"
  ],
  "simonh1000/elm-sliding-menus": [
    "1.0.0",
    "1.0.1"
  ],
  "simplystuart/elm-scroll-to": [
    "1.0.0"
  ],
  "sindikat/elm-matrix": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "sindikat/elm-maybe-experimental": [
    "1.0.0"
  ],
  "sixty-north/elm-price-chart": [
    "1.0.0",
    "2.0.0"
  ],
  "sixty-north/elm-task-repeater": [
    "1.0.0",
    "1.0.1"
  ],
  "sjorn3/elm-fields": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "skyqrose/assoc-list-extra": [
    "1.0.0"
  ],
  "slashmili/phoenix-socket": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.2.1"
  ],
  "sli/autotable": [
    "1.0.0"
  ],
  "smucode/elm-flat-colors": [
    "1.0.0"
  ],
  "smurfix/elm-dict-tree-zipper": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "soenkehahn/elm-operational": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "soenkehahn/elm-operational-mocks": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "4.0.1"
  ],
  "solcates/elm-openid-connect": [
    "1.0.0",
    "1.0.1"
  ],
  "sparksp/elm-review-always": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "sparksp/elm-review-camelcase": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0"
  ],
  "sparksp/elm-review-forbidden-words": [
    "1.0.0",
    "1.0.1"
  ],
  "sparksp/elm-review-ports": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0"
  ],
  "spect88/romkan-elm": [
    "1.0.0"
  ],
  "splodingsocks/elm-add-import": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "splodingsocks/elm-easy-events": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "1.2.0"
  ],
  "splodingsocks/elm-html-table": [
    "1.0.0",
    "1.0.1"
  ],
  "splodingsocks/elm-tailwind": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "2.2.0",
    "2.2.1"
  ],
  "splodingsocks/elm-type-extractor": [
    "1.0.0"
  ],
  "splodingsocks/hipstore-ui": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "splodingsocks/validatable": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "sporto/elm-autocomplete": [
    "1.0.0"
  ],
  "sporto/elm-countries": [
    "1.0.0"
  ],
  "sporto/elm-dropdown": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.4.0"
  ],
  "sporto/elm-select": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.5.0",
    "2.5.1",
    "2.6.0",
    "2.7.0",
    "2.8.0",
    "2.9.0",
    "2.10.0",
    "2.11.0",
    "2.12.0",
    "2.12.1",
    "2.13.0",
    "2.14.0",
    "2.15.0",
    "2.15.1",
    "2.16.0",
    "2.17.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3",
    "3.2.0"
  ],
  "sporto/erl": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.1.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "8.0.0",
    "9.0.0",
    "9.0.1",
    "10.0.0",
    "10.0.1",
    "10.0.2",
    "11.0.0",
    "11.1.0",
    "11.1.1",
    "12.0.0",
    "13.0.0",
    "13.0.1",
    "13.0.2",
    "14.0.0"
  ],
  "sporto/hop": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "5.0.0",
    "5.0.1",
    "5.1.0",
    "6.0.0",
    "6.0.1"
  ],
  "sporto/polylinear-scale": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "sporto/qs": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0"
  ],
  "sporto/time-distance": [
    "1.0.0",
    "1.0.1"
  ],
  "stephenreddek/elm-emoji": [
    "1.0.0"
  ],
  "stephenreddek/elm-range-slider": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "stephenreddek/elm-time-picker": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "stil4m/elm-aui-css": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.1.0",
    "4.1.1"
  ],
  "stil4m/elm-devcards": [
    "1.0.0",
    "1.0.1"
  ],
  "stil4m/elm-syntax": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "3.1.3",
    "3.1.4",
    "3.2.0",
    "3.3.0",
    "3.3.1",
    "3.4.0",
    "3.4.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "6.1.1",
    "7.0.0",
    "7.0.1",
    "7.0.2",
    "7.0.3",
    "7.0.4",
    "7.0.5",
    "7.0.6",
    "7.1.0",
    "7.1.1",
    "7.1.2",
    "7.1.3"
  ],
  "stil4m/rfc2822-datetime": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "stil4m/structured-writer": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "stoeffel/datetimepicker": [
    "1.0.0"
  ],
  "stoeffel/editable": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.0.1"
  ],
  "stoeffel/elm-verify": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "4.0.0",
    "5.0.0"
  ],
  "stoeffel/resetable": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "stoeffel/set-extra": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.2.3"
  ],
  "stowga/elm-datepicker": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "sudo-rushil/elm-cards": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.2.0"
  ],
  "supermacro/elm-antd": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0"
  ],
  "supermario/elm-countries": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0"
  ],
  "supermario/html-test-runner": [
    "1.0.2",
    "1.0.3",
    "1.0.4"
  ],
  "surprisetalk/elm-bulma": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "4.1.4",
    "4.1.5",
    "5.0.0",
    "6.0.0",
    "6.0.1",
    "6.0.2",
    "6.1.0",
    "6.1.1",
    "6.1.2",
    "6.1.3",
    "6.1.4",
    "6.1.5",
    "6.1.6"
  ],
  "surprisetalk/elm-font-awesome": [
    "1.0.0"
  ],
  "surprisetalk/elm-icon": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1"
  ],
  "surprisetalk/elm-ionicons": [
    "1.0.0"
  ],
  "surprisetalk/elm-material-icons": [
    "1.0.0",
    "1.0.1"
  ],
  "surprisetalk/elm-open-iconic": [
    "1.0.0"
  ],
  "surprisetalk/elm-pointless": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "swiftengineer/elm-data": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0"
  ],
  "swiftsnamesake/euclidean-space": [
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.2.1"
  ],
  "synbioz/elm-time-overlap": [
    "1.0.0",
    "1.0.1"
  ],
  "szabba/elm-animations": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0"
  ],
  "szabba/elm-laws": [
    "1.0.0"
  ],
  "szabba/elm-timestamp": [
    "1.0.0",
    "2.0.0"
  ],
  "tad-lispy/springs": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5"
  ],
  "tapeinosyne/elm-microkanren": [
    "1.0.0"
  ],
  "teepark/elmoji": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "teocollin1995/complex": [
    "1.0.0",
    "1.0.1"
  ],
  "terezka/app": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "3.0.0"
  ],
  "terezka/colors": [
    "1.0.0"
  ],
  "terezka/elm-cartesian-svg": [
    "1.0.1"
  ],
  "terezka/elm-charts": [
    "1.0.0"
  ],
  "terezka/elm-charts-alpha": [
    "1.0.0"
  ],
  "terezka/elm-plot": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.1.0"
  ],
  "terezka/elm-plot-rouge": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0",
    "2.4.0",
    "2.4.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0",
    "4.1.0"
  ],
  "terezka/line-charts": [
    "2.0.0",
    "2.0.1"
  ],
  "terezka/url-parser": [
    "1.0.0"
  ],
  "terezka/yaml": [
    "1.0.0",
    "1.0.1"
  ],
  "tesk9/accessible-html": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "4.0.0"
  ],
  "tesk9/accessible-html-with-css": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1"
  ],
  "tesk9/elm-html-a11y": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2"
  ],
  "tesk9/elm-html-textup": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "tesk9/elm-tabs": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "3.0.1"
  ],
  "tesk9/focus-style-manager": [
    "1.0.0"
  ],
  "tesk9/modal": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "7.0.0"
  ],
  "tesk9/palette": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0",
    "2.0.0",
    "3.0.0",
    "3.0.1"
  ],
  "thSoft/key-constants": [
    "1.0.2",
    "1.0.3"
  ],
  "thalissonmelo/elmcounter": [
    "1.0.0"
  ],
  "thaterikperson/elm-blackjack": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.1.0"
  ],
  "thaterikperson/elm-strftime": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "the-sett/ai-search": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.1.2",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.1.0",
    "4.1.1",
    "5.0.0"
  ],
  "the-sett/auth-elm": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "3.0.5"
  ],
  "the-sett/decode-generic": [
    "1.0.0"
  ],
  "the-sett/elm-auth": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "5.0.0"
  ],
  "the-sett/elm-auth-aws": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "the-sett/elm-aws-cognito": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "2.0.0"
  ],
  "the-sett/elm-aws-core": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "6.0.0",
    "7.0.0",
    "7.1.0"
  ],
  "the-sett/elm-color": [
    "1.0.0",
    "1.0.1"
  ],
  "the-sett/elm-enum": [
    "1.0.0",
    "1.0.1"
  ],
  "the-sett/elm-error-handling": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.2.0"
  ],
  "the-sett/elm-localstorage": [
    "1.0.0",
    "2.0.0",
    "3.0.0"
  ],
  "the-sett/elm-one-many": [
    "1.0.0",
    "1.1.0"
  ],
  "the-sett/elm-pretty-printer": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.2.0",
    "2.2.1",
    "2.2.2",
    "2.2.3"
  ],
  "the-sett/elm-refine": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0"
  ],
  "the-sett/elm-serverless": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "the-sett/elm-state-machines": [
    "1.0.0",
    "1.0.1"
  ],
  "the-sett/elm-string-case": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "the-sett/elm-syntax-dsl": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "2.2.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.1.0"
  ],
  "the-sett/elm-update-helper": [
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "1.4.1"
  ],
  "the-sett/json-optional": [
    "1.0.0"
  ],
  "the-sett/lazy-list": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "the-sett/salix": [
    "1.0.0",
    "2.0.0"
  ],
  "the-sett/svg-text-fonts": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "4.0.0"
  ],
  "the-sett/tea-tree": [
    "1.0.0"
  ],
  "the-sett/the-sett-laf": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0",
    "6.1.0"
  ],
  "thebookofeveryone/elm-composer": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "thebritican/elm-autocomplete": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.3.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3"
  ],
  "thematthopkins/elm-test-journey": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "thomasloh/elm-phone": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "thought2/elm-interactive": [
    "1.0.0"
  ],
  "thought2/elm-vectors": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "thought2/elm-wikimedia-commons": [
    "1.0.0",
    "1.0.1"
  ],
  "thoughtbot/expirable": [
    "1.0.0",
    "2.0.0"
  ],
  "tilmans/elm-style-elements-drag-drop": [
    "1.0.0",
    "1.0.2",
    "1.0.3"
  ],
  "timjs/elm-collage": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "timo-weike/generic-collections": [
    "1.0.0"
  ],
  "tiziano88/elm-oauth": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "tiziano88/elm-protobuf": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "3.0.0"
  ],
  "tiziano88/elm-tfl": [
    "1.0.0"
  ],
  "tj/elm-svg-loaders": [
    "1.0.0"
  ],
  "tlentz/elm-adjustable-table": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "tlentz/elm-fancy-table": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "toastal/either": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "3.3.0",
    "3.4.0",
    "3.4.1",
    "3.5.0",
    "3.5.1",
    "3.5.2"
  ],
  "toastal/endo": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "toastal/mailto": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0"
  ],
  "toastal/return-optics": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.1.0",
    "1.1.1"
  ],
  "toastal/select-prism": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "toastal/trinary": [
    "1.0.0",
    "1.0.1"
  ],
  "tomjkidd/elm-multiway-tree-zipper": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0",
    "1.5.0",
    "1.6.0",
    "1.7.0",
    "1.8.0",
    "1.9.0",
    "1.10.0",
    "1.10.1",
    "1.10.2",
    "1.10.3"
  ],
  "torgeir/elm-github-events": [
    "1.0.0",
    "2.0.0"
  ],
  "torreyatcitty/the-best-decimal": [
    "1.0.0"
  ],
  "tortis/elm-sat": [
    "1.0.0",
    "1.0.1"
  ],
  "tortus/elm-array-2d": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.0.5",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "3.0.0"
  ],
  "treffynnon/elm-tfn": [
    "1.0.0"
  ],
  "tremlab/bugsnag-elm": [
    "1.0.0",
    "2.0.0"
  ],
  "tricycle/elm-actor-framework": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0",
    "1.3.0"
  ],
  "tricycle/elm-actor-framework-sandbox": [
    "1.0.0",
    "1.1.0"
  ],
  "tricycle/elm-actor-framework-template": [
    "1.0.0"
  ],
  "tricycle/elm-actor-framework-template-html": [
    "1.0.0",
    "1.0.1"
  ],
  "tricycle/elm-actor-framework-template-markdown": [
    "1.0.0"
  ],
  "tricycle/elm-email": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "tricycle/elm-embed-youtube": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2"
  ],
  "tricycle/elm-eventstream": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "tricycle/elm-imgix": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.3.0",
    "1.4.0"
  ],
  "tricycle/elm-infinite-gallery": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "tricycle/elm-infnite-gallery": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "tricycle/elm-parse-dont-validate": [
    "1.0.0"
  ],
  "tricycle/elm-storage": [
    "1.0.0"
  ],
  "tricycle/morty-api": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "4.0.0"
  ],
  "tricycle/system-actor-model": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "4.2.0",
    "4.2.1",
    "4.2.2",
    "4.2.3",
    "4.2.4",
    "4.3.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "7.0.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "9.0.0"
  ],
  "trifectalabs/elm-polyline": [
    "1.0.0",
    "1.0.1"
  ],
  "tripokey/elm-fuzzy": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.1.0",
    "5.2.0",
    "5.2.1"
  ],
  "truqu/elm-base64": [
    "1.0.0",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "1.0.6",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4"
  ],
  "truqu/elm-dictset": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.0.5",
    "2.0.0",
    "2.1.0"
  ],
  "truqu/elm-md5": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "truqu/elm-mustache": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3"
  ],
  "truqu/elm-oauth2": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.1.0",
    "2.2.0",
    "2.2.1",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "7.0.0"
  ],
  "truqu/elm-review-nobooleancase": [
    "1.0.0"
  ],
  "truqu/elm-review-noleftpizza": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "truqu/elm-review-noredundantconcat": [
    "1.0.0"
  ],
  "truqu/elm-review-noredundantcons": [
    "1.0.0"
  ],
  "truqu/line-charts": [
    "1.0.0"
  ],
  "tryzniak/assoc": [
    "1.0.0"
  ],
  "tunguski/elm-ast": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3"
  ],
  "turboMaCk/any-dict": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "2.2.0",
    "2.3.0"
  ],
  "turboMaCk/any-set": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.2.0",
    "1.3.0",
    "1.4.0"
  ],
  "turboMaCk/chae-tree": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "2.1.0",
    "2.1.1"
  ],
  "turboMaCk/elm-continue": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "turboMaCk/glue": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "6.0.0",
    "6.1.0",
    "6.2.0"
  ],
  "turboMaCk/grid-solver": [
    "1.0.0",
    "1.0.1",
    "2.0.0"
  ],
  "turboMaCk/lazy-tree-with-zipper": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.1.0",
    "3.1.1",
    "3.1.2"
  ],
  "turboMaCk/non-empty-list-alias": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "turboMaCk/queue": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "tuxagon/elm-pokeapi": [
    "1.0.0",
    "1.0.1"
  ],
  "typed-wire/elm-typed-wire-utils": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "ucode/elm-path": [
    "1.0.0",
    "1.0.1"
  ],
  "ursi/elm-css-colors": [
    "1.0.0"
  ],
  "ursi/elm-scroll": [
    "1.0.0"
  ],
  "ursi/elm-throttle": [
    "1.0.0",
    "1.0.1"
  ],
  "ursi/support": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "utkarshkukreti/elm-inflect": [
    "1.0.0"
  ],
  "vViktorPL/elm-incremental-list": [
    "1.0.0",
    "1.0.1"
  ],
  "vViktorPL/elm-jira-connector": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0",
    "1.2.0"
  ],
  "valberg/elm-django-channels": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0"
  ],
  "valentinomicko/test-forms": [
    "1.0.0"
  ],
  "vateira/elm-bem-helpers": [
    "1.0.0"
  ],
  "vernacular-ai/elm-flow-chart": [
    "1.0.0",
    "2.0.0",
    "2.1.0",
    "3.0.0"
  ],
  "vieiralucas/elm-collections": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "viir/simplegamedev": [
    "1.0.0"
  ],
  "vilterp/elm-diagrams": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.0.3",
    "2.0.4",
    "2.1.0",
    "2.1.1",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "7.0.0",
    "7.1.0",
    "7.2.0"
  ],
  "vilterp/elm-html-extra": [
    "1.0.1"
  ],
  "vilterp/elm-pretty-print": [
    "1.0.0",
    "1.0.1"
  ],
  "vipentti/elm-dispatch": [
    "1.0.0",
    "1.0.1"
  ],
  "visotype/elm-dom": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.1.2",
    "1.1.3"
  ],
  "visotype/elm-eval": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "vito/elm-ansi": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "2.1.0",
    "2.1.1",
    "2.1.2",
    "2.1.3",
    "3.0.0",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1",
    "5.0.2",
    "5.0.3",
    "5.0.4",
    "6.0.0",
    "6.0.1",
    "7.0.0",
    "7.0.1",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.0.3",
    "8.1.0",
    "9.0.0",
    "9.0.1"
  ],
  "vjrasane/elm-dynamic-json": [
    "1.0.0"
  ],
  "vmchale/elm-composition": [
    "1.0.0",
    "2.0.0"
  ],
  "volumeint/screen-overlay": [
    "1.0.0"
  ],
  "volumeint/sortable-table": [
    "1.0.0",
    "1.0.1"
  ],
  "w0rm/elm-physics": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1",
    "3.2.2",
    "4.0.0",
    "5.0.0"
  ],
  "w0rm/elm-slice-show": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "3.0.1",
    "3.0.2",
    "3.0.3",
    "3.0.4",
    "4.0.0",
    "4.1.0",
    "5.0.0",
    "5.0.1",
    "5.0.2"
  ],
  "waratuman/elm-coder": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "3.0.0",
    "3.0.1"
  ],
  "waratuman/elm-json-extra": [
    "1.0.0"
  ],
  "waratuman/elm-standardapi": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "5.0.0",
    "6.0.0"
  ],
  "waratuman/json-extra": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "waratuman/time-extra": [
    "1.0.0",
    "1.1.0"
  ],
  "warry/ascii-table": [
    "1.0.0"
  ],
  "wearsunscreen/gen-garden": [
    "1.0.0"
  ],
  "webbhuset/elm-actor-model": [
    "1.0.0",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "3.0.0",
    "4.0.0"
  ],
  "webbhuset/elm-actor-model-elm-ui": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "webbhuset/elm-json-decode": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "wells-wood-research/elm-molecules": [
    "1.0.0",
    "2.0.0"
  ],
  "wende/elm-ast": [
    "1.0.0"
  ],
  "werner/diyalog": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "wernerdegroot/listzipper": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "3.2.0",
    "4.0.0"
  ],
  "whage/elm-validate": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "whale9490/elm-split-pane": [
    "1.0.0"
  ],
  "will-clarke/elm-tiled-map": [
    "1.0.0",
    "1.0.1"
  ],
  "williamwhitacre/elm-encoding": [
    "1.0.0",
    "1.1.0"
  ],
  "williamwhitacre/elm-lexer": [
    "1.0.0",
    "1.1.0",
    "1.2.0"
  ],
  "williamwhitacre/pylon": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.2.0",
    "4.3.0",
    "4.4.0",
    "4.4.1",
    "4.5.0",
    "4.6.0",
    "4.6.1",
    "4.7.0",
    "4.7.1",
    "4.7.2",
    "4.7.3",
    "4.7.4",
    "4.7.5",
    "4.8.0",
    "4.9.0",
    "4.10.0",
    "4.11.0",
    "4.12.0",
    "4.13.0",
    "4.13.1",
    "4.14.0",
    "4.15.0",
    "4.16.0",
    "4.17.0",
    "4.18.0",
    "5.0.0",
    "5.1.0",
    "6.0.0",
    "6.0.1",
    "6.1.0",
    "6.2.0",
    "6.3.0",
    "6.4.0",
    "6.5.0",
    "6.5.1",
    "6.5.2",
    "6.5.3",
    "6.5.4",
    "6.6.0",
    "6.7.0",
    "6.7.1",
    "6.8.0",
    "6.9.0",
    "6.10.0",
    "7.0.0",
    "7.1.0",
    "7.2.0",
    "7.3.0",
    "7.4.0",
    "7.5.0",
    "7.6.0",
    "8.0.0",
    "8.0.1",
    "8.0.2",
    "8.1.0",
    "8.1.1",
    "8.1.2",
    "8.1.3",
    "8.1.4",
    "8.1.5",
    "8.1.6",
    "8.1.7",
    "8.1.8",
    "8.1.9",
    "8.1.10",
    "8.1.11",
    "8.1.12",
    "8.2.0",
    "8.3.0",
    "8.4.0",
    "8.5.0",
    "8.5.1",
    "8.5.2",
    "8.5.3",
    "8.5.4",
    "8.5.5",
    "8.6.0",
    "8.7.0",
    "8.7.1",
    "8.7.2",
    "8.7.4",
    "8.8.0",
    "8.8.1",
    "8.8.2",
    "8.9.0",
    "8.10.0",
    "9.0.0"
  ],
  "wingyplus/thai-citizen-id": [
    "1.0.0"
  ],
  "wintvelt/elm-print-any": [
    "1.0.0"
  ],
  "wittjosiah/elm-alerts": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "wittjosiah/elm-ordered-dict": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "wjdhamilton/elm-json-api-helpers": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "wking-io/pair": [
    "1.0.0",
    "1.0.1"
  ],
  "wolfadex/elm-text-adventure": [
    "1.0.0",
    "2.0.0"
  ],
  "wolfadex/locale-negotiation": [
    "1.0.0"
  ],
  "wolfadex/tiler": [
    "1.0.0",
    "1.0.1"
  ],
  "wuct/elm-charts": [
    "1.0.2"
  ],
  "xarvh/elm-dropdown-menu": [
    "1.0.0"
  ],
  "xarvh/elm-gamepad": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "3.0.0"
  ],
  "xarvh/elm-slides": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.1.1",
    "4.0.0",
    "4.0.1",
    "5.0.0",
    "5.0.1"
  ],
  "xarvh/elm-styled-html": [
    "1.0.0",
    "1.1.0",
    "1.1.1"
  ],
  "xarvh/lexical-random-generator": [
    "1.0.0"
  ],
  "xdelph/elm-slick-grid": [
    "1.0.0",
    "1.1.0"
  ],
  "xdelph/elm-sortable-table": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "xerono/pinnablecache": [
    "1.0.0"
  ],
  "xilnocas/step": [
    "1.0.0",
    "1.1.0",
    "2.0.0",
    "2.1.0",
    "3.0.0",
    "3.0.1",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.1.3",
    "4.1.4"
  ],
  "y-taka-23/elm-github-ribbon": [
    "1.0.0",
    "1.0.1"
  ],
  "y047aka/elm-hsl-color": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "y047aka/elm-reset-css": [
    "1.0.0",
    "1.1.0",
    "2.0.0"
  ],
  "y0hy0h/ordered-containers": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "ydschneider/regex-builder": [
    "1.0.0",
    "1.0.1"
  ],
  "ymtszw/elm-amazon-product-advertising": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.1.0"
  ],
  "ymtszw/elm-broker": [
    "1.0.0"
  ],
  "ymtszw/elm-http-xml": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "2.0.0"
  ],
  "ymtszw/elm-xml-decode": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "3.0.0",
    "3.1.0",
    "3.2.0",
    "3.2.1"
  ],
  "yotamDvir/elm-katex": [
    "1.0.0",
    "2.0.0",
    "2.0.1"
  ],
  "yotamDvir/elm-pivot": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "3.0.0",
    "3.1.0"
  ],
  "yujota/elm-asap-pathology-format": [
    "1.0.0"
  ],
  "yujota/elm-collision-detection": [
    "1.0.0",
    "1.0.1"
  ],
  "yujota/elm-makie": [
    "1.0.0"
  ],
  "yujota/elm-pascal-voc": [
    "1.0.0"
  ],
  "yumlonne/elm-japanese-calendar": [
    "1.0.0"
  ],
  "z5h/component-result": [
    "1.0.0",
    "1.0.1",
    "1.1.0"
  ],
  "z5h/jaro-winkler": [
    "1.0.0",
    "1.0.1",
    "1.0.2"
  ],
  "z5h/timeline": [
    "1.0.0",
    "1.0.1"
  ],
  "z5h/zipper": [
    "1.0.0",
    "1.0.1"
  ],
  "zaboco/elm-draggable": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "1.0.3",
    "1.0.4",
    "1.1.0",
    "1.1.1",
    "2.0.0",
    "2.0.1",
    "2.0.2",
    "2.1.0",
    "3.0.0",
    "2.1.1",
    "3.1.0",
    "4.0.0",
    "4.0.1",
    "4.0.2",
    "4.0.3",
    "4.0.4",
    "4.0.5",
    "4.0.6"
  ],
  "zaidan/elm-collision": [
    "1.0.0",
    "1.0.1"
  ],
  "zaidan/elm-gridbox": [
    "1.0.0"
  ],
  "zaptic/elm-decode-pipeline-strict": [
    "1.0.0"
  ],
  "zarvunk/tuple-map": [
    "1.0.0"
  ],
  "zeckalpha/char-extra": [
    "1.0.0"
  ],
  "zeckalpha/elm-sexp": [
    "1.0.0"
  ],
  "zgohr/elm-csv": [
    "1.0.0",
    "1.0.1"
  ],
  "zwilias/elm-avl-dict-exploration": [
    "1.0.0",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.2.1",
    "1.2.2"
  ],
  "zwilias/elm-bytes-parser": [
    "1.0.0"
  ],
  "zwilias/elm-disco": [
    "1.0.0"
  ],
  "zwilias/elm-holey-zipper": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1"
  ],
  "zwilias/elm-html-string": [
    "1.0.0",
    "1.0.1",
    "1.0.2",
    "2.0.0",
    "2.0.1",
    "2.0.2"
  ],
  "zwilias/elm-reorderable": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.1.1",
    "1.2.0",
    "1.3.0"
  ],
  "zwilias/elm-rosetree": [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0",
    "1.3.1",
    "1.4.0",
    "1.5.0"
  ],
  "zwilias/elm-toml": [
    "1.0.0"
  ],
  "zwilias/elm-touch-events": [
    "1.0.0",
    "1.0.1",
    "1.1.0",
    "1.2.0"
  ],
  "zwilias/elm-transcoder": [
    "1.0.0"
  ],
  "zwilias/elm-tree": [
    "1.0.0"
  ],
  "zwilias/elm-utf-tools": [
    "1.0.0",
    "1.0.1",
    "2.0.0",
    "2.0.1"
  ],
  "zwilias/json-decode-exploration": [
    "1.0.0",
    "2.0.0",
    "3.0.0",
    "4.0.0",
    "4.1.0",
    "4.1.1",
    "4.1.2",
    "4.2.0",
    "4.2.1",
    "4.3.0",
    "5.0.0",
    "5.0.1",
    "6.0.0"
  ],
  "zwilias/json-encode-exploration": [
    "1.0.0"
  ]
}
"""
