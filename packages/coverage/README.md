[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/website/static/img/header.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/coverage`

[![npm version](https://img.shields.io/npm/v/@betterer/coverage.svg)](https://www.npmjs.com/package/@betterer/coverage)

Code coverage test for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage
Before running betterer: run your test suite (e.g. jest) with coverage information written to `coverage/coverage-summary.json`
using the [Istanbul](https://istanbul.js.org/) [json-summary](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib/json-summary)
reporter (or any reporter which creates compatible output).

Set up your `.betterer.js` (or equivalent) file like so:

```
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage()
};      
```

Betterer will now fail if your test coverage decreases on any of your files.
You can also configure the test to only consider total coverage, like so:

```
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage({
    totalCoverage: true
  })
};      
```
