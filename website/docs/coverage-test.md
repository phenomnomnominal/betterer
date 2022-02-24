---
id: coverage-test
title: Coverage test
slug: /coverage-test
---

**Betterer** ships several built-in tests to get you started. Check out the [implementations](https://github.com/phenomnomnominal/betterer/blob/master/packages/coverage/src/coverage.ts) for inspiration for your own tests!

### [`@betterer/coverage`](https://www.npmjs.com/package/@betterer/coverage)

Use this test to increase the test coverage of your project.

Before running betterer: run your test suite (e.g. jest) with coverage information written to `coverage/coverage-summary.json`
using the [Istanbul](https://istanbul.js.org/) [json-summary](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib/json-summary)
reporter (or any reporter which creates compatible output).

Set up your `.betterer.js` (or equivalent) file like so:

```javascript
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage()
};      
```

Betterer will now fail if your test coverage decreases on any of your files.
You can also configure the test to only consider total coverage, like so:

```javascript
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage({
    totalCoverage: true
  })
};      
```
