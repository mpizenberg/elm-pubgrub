# elm-pubgrub

This package provides an implementation of the PubGrub
version solving algorithm in the Elm programming language.

## Run the examples

Hardcoded examples are located in the `Database.Stub` module.
To run example "N" replace the function inside `getDependencies`
by `getDependenciesN` and the function inside `listAvailableVersions`
by `listAvailableVersionsN`.
Then inside the elm repl run the following commands.

```elm
import PubGrub
import Version
PubGrub.solve "root" Version.one
```

Examples are extracted from [PubGrub implementation guide][examples].
Examples 1 to 4 are made increasingly harder by triggering more parts
of the algorithm and are all passing.
Example 5 is the first error reporting algorithm
but error reporting is not implemented yet.

PS: you can stay in the repl and change the example in `Database.Stub`,
it will be automatically picked up next time you run `PubGrub.solve`.

[examples]: https://github.com/dart-lang/pub/blob/master/doc/solver.md#examples

## PubGrub

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

## Packages data

```sh
curl -L https://package.elm-lang.org/all-packages | jq . > history.json
curl -L https://package.elm-lang.org/all-packages/since/90 | jq . > history-since-90.json

curl --compressed https://package.elm-lang.org/packages/elm/parser/1.1.0/elm.json > parser.elm.json
```
