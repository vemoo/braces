# braces [![NPM version](https://badge.fury.io/js/braces.svg)](http://badge.fury.io/js/braces)

> Fastest brace expansion for node.js, with more complete support of Bash 4.3 than minimatch.

 - Expands comma-separated values: `a/{b,c}/d` => `['a/b/d', 'a/c/d']`
 - Expands alphabetical or numerical ranges: `{1..3}` => `['1', '2', '3']`
 - Better Bash 4.3 coverage than [minimatch](https://github.com/isaacs/minimatch), braces passes [most of the unit tests](#bash-4-3) from the [Bash 4.3 specification][bash], with a few [intentional differences](#differences).
 - Braces is faster than minimatch in every benchmark, and its [10x faster](#benchmarks) than minimatch in the most common usage scenarios. 
 - [Special characters](./patterns.md) can be used to generate interesting patterns.


## Install with [npm](npmjs.org)

```bash
npm i braces --save
```


## Example usage

```js
var braces = require('braces');

braces('a/{x,y}/c{d}e')
//=> ['a/x/cde', 'a/y/cde']

braces('a/b/c/{x,y}')
//=> ['a/b/c/x', 'a/b/c/y']

braces('a/{x,{1..5},y}/c{d}e')
//=> ['a/x/cde', 'a/1/cde', 'a/y/cde', 'a/2/cde', 'a/3/cde', 'a/4/cde', 'a/5/cde']
```

### Pro tip!

> Use braces to generate test fixtures!

**Example**

```js
var braces = require('./');
var path = require('path');
var fs = require('fs');

braces('blah/{a..z}.js').forEach(function(fp) {
  if (!fs.existsSync(path.dirname(fp))) {
    fs.mkdirSync(path.dirname(fp));
  }
  fs.writeFileSync(fp, '');
});
```

See the [tests](./test/test.js) for more examples and use cases (also see the [bash spec tests](./test/bash-mm-adjusted.js));


### Range expansion

Uses [expand-range](https://github.com/jonschlinkert/expand-range) for range expansion.

```js
braces('a{1..3}b')
//=> ['a1b', 'a2b', 'a3b']

braces('a{5..8}b')
//=> ['a5b', 'a6b', 'a7b', 'a8b']

braces('a{00..05}b')
//=> ['a00b', 'a01b', 'a02b', 'a03b', 'a04b', 'a05b']

braces('a{01..03}b')
//=> ['a01b', 'a02b', 'a03b']

braces('a{000..005}b')
//=> ['a000b', 'a001b', 'a002b', 'a003b', 'a004b', 'a005b']

braces('a{a..e}b')
//=> ['aab', 'abb', 'acb', 'adb', 'aeb']

braces('a{A..E}b')
//=> ['aAb', 'aBb', 'aCb', 'aDb', 'aEb']
```

Pass a function as the last argument to customize range expansions:

```js
var range = braces('x{a..e}y', function (str, i) {
  return String.fromCharCode(str) + i;
});

console.log(range);
//=> ['xa0y', 'xb1y', 'xc2y', 'xd3y', 'xe4y']
```

See [expand-range](https://github.com/jonschlinkert/expand-range) for benchmarks, tests and the full list of range expansion features.


## Bash 4.3

> Better support for Bash 4.3 than minimatch

This project has comprehensive unit tests, including tests coverted from [Bash 4.3][bash]. Currently only 8 of 102 unit tests fail, and  

### Differences

**Main differences from Bash:**

 - In bash (and minimatch) the braces are retained when only one set exists. ex: `a{b}c` => `['a{b}c']`. Since this can cause problems with routes and config templates etc., single-set valid braces are removed. e.g `a{b}c` => `['abc']`
 - duplicates are removed by default. To keep dupes, pass `nodupes: false` on the options

**New features:**

 - Support for (ignoring) es6 delimiters. ex: `a/${b}/{c,d}` => `['a/${b}/c', 'a/${b}/d']`


## Benchmarks

```bash
#1: escape.js
  brace-expansion.js x 114,934 ops/sec ±1.24% (93 runs sampled)
  braces.js x 342,254 ops/sec ±0.84% (90 runs sampled)

#2: exponent.js
  brace-expansion.js x 12,359 ops/sec ±0.86% (96 runs sampled)
  braces.js x 20,389 ops/sec ±0.71% (97 runs sampled)

#3: multiple.js
  brace-expansion.js x 114,469 ops/sec ±1.44% (94 runs sampled)
  braces.js x 401,621 ops/sec ±0.87% (91 runs sampled)

#4: nested.js
  brace-expansion.js x 102,769 ops/sec ±1.55% (92 runs sampled)
  braces.js x 314,088 ops/sec ±0.71% (98 runs sampled)

#5: normal.js
  brace-expansion.js x 157,577 ops/sec ±1.65% (91 runs sampled)
  braces.js x 1,115,950 ops/sec ±0.74% (94 runs sampled)

#6: range.js
  brace-expansion.js x 138,822 ops/sec ±1.71% (91 runs sampled)
  braces.js x 1,108,353 ops/sec ±0.85% (94 runs sampled)
```

Run the benchmarks:

```bash
node benchmark
```


## Run tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Related

- [micromatch]: wildcard/glob matcher for javascript. a faster alternative to minimatch.
- [fill-range]: Fill in a range of numbers or letters, optionally passing an increment or multiplier to use
- [expand-range]: Wraps fill-range for fast, bash-like range expansion in strings. Expand a range of numbers or letters, uppercase or lowercase

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/braces/issues).

Please run benchmarks before and after any code changes to what the impact of the code changes are before submitting a PR. 

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014-2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on January 30, 2015._

[bash]: www.gnu.org/software/bash/

[fill-expand]: https://github.com/jonschlinkert/fill-expand
[fill-range]: https://github.com/jonschlinkert/fill-range
[micromatch]: https://github.com/jonschlinkert/micromatch
[braces]: https://github.com/jonschlinkert/braces
