# elm-pubgrub

This package provides an implementation of the PubGrub
version solving algorithm in the Elm programming language.

It consists in efficiently finding a set of packages and versions
that satisfy all the constraints of a given project dependencies.
In addition, when that is not possible,
PubGrub tries to provide a very human-readable and clear
explaination as to why that failed.
Below is an example of explanation present in
the introductory blog post about PubGrub
(elm-pubgrub is almost there ^^).

```txt
Because dropdown >=2.0.0 depends on icons >=2.0.0 and root depends
  on icons <2.0.0, dropdown >=2.0.0 is forbidden.

And because menu >=1.1.0 depends on dropdown >=2.0.0, menu >=1.1.0
  is forbidden.

And because menu <1.1.0 depends on dropdown >=1.0.0 <2.0.0 which
  depends on intl <4.0.0, every version of menu requires intl
  <4.0.0.

So, because root depends on both menu >=1.0.0 and intl >=5.0.0,
  version solving failed.
```

The algorithm is generic and works for any type of dependency system
with the following caracteristics, not only Elm packages.

 - Versions use the semantic versioning scheme (Major.Minor.Patch).
 - Packages cannot be simultaneously present at two different versions.
 - Dependencies are expressed in one of the following forms
   - exact version (`foo 1.0.0 depends bar 1.0.0`)
   - higher or equal version (`foo 1.0.0 depends on bar >= 1.0.0`)
   - stricly lower version (`foo 1.0.0 depends on bar < 2.0.0`)
   - ranges of versions (`foo 1.0.0 depends on bar 1.0.0 <= v < 2.0.0`)

PS: at publication, only the `PubGrub`, `Version`, `Range`, and `Term`
modules will be exposed.
Others are exposed for easy docs usage at the moment.


## API

The algorithm is provided in two forms, synchronous and asynchronous.
The synchronous API is quite straightforward.
The async one uses the `Effect` pattern to be easily integrated
into the TEA architecture.

### Direct sync call

```elm
PubGrub.solve config package version
```

Where config provides the list of available packages and versions,
as well as the dependencies of every available package.
The call to `PubGrub.solve` for a given package at a given version
will compute the set of packages and versions needed.

### Async API

Sometimes, it is too expensive to provide upfront
the list of all packages and versions,
as well as all dependencies for every one of those.
This may very well require some network or other async requests.
For this reason, it is possible to run the PubGrub algorithm step by step.
Every time an effect may be required, it stops and informs the caller,
which may resume the algorithm once necessary data is loaded.

```elm
PubGrub.update : Connectivity -> Cache -> Msg -> State -> ( State, Effect )
```

The `Effect` type is public to enable the caller to perform
the required task before resuming.
The `Msg` type is also public to drive the algorithm according
to what was expected in the last effect when resuming.

At any point between two `update` calls,
the caller can change the `Connectivity`
and update the `Cache` of already loaded data.

The algorithm informs the caller that all is done
when the `SignalEnd result` effect is emitted.


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


## Elm packages (personal reminder)

```sh
curl -L https://package.elm-lang.org/all-packages | jq . > history.json
curl -L https://package.elm-lang.org/all-packages/since/90 | jq . > history-since-90.json

curl --compressed https://package.elm-lang.org/packages/elm/parser/1.1.0/elm.json > parser.elm.json
```
