---
id: results-file
title: Results file
sidebar_label: Results file
slug: /results-file
---

All your test results will be saved in a results file. By default, **Betterer** sets this to be `.betterer.results`, but you can change that by using the [`--results`](./running-betterer#start-options) flag when running **Betterer**.

The results file is similar to a [Jest Snapshot file](https://jestjs.io/docs/en/snapshot-testing). It should be [commited along with your code](./development-workflow) and probably shouldn't be [updated](./updating-results) manually (although you of course can if you're feeling confident!).

The results file will look something like this:

```javascript
// BETTERER RESULTS V2.
exports[`no hack comments`] = {
  value: `{
    "packages/cli/src/cli.ts:1074837834": [
      [13, 0, 7, "RegExp match", "645651780"]
    ],
    "packages/cli/src/init/update-package-json.ts:2842907794": [
      [34, 4, 7, "RegExp match", "645651780"]
    ]
  }`
};
```

This is a valid JavaScript file, so you can require it and manipulate it if you need to. Each test will have an object that stores its result value, which can be controlled by a tests `serialise` and `printer` options.

When your tests run, **Betterer** will check to see the result against the expected result in the results file. If the new result is better, the results file will be updated, and that result will be the expected baseline going forward.

### `BettererFileTest` results

The above example comes from a `BettererFileTest`, which has some note-worthy details. A `BettererFileTest` result has the following format:

```javascript
exports[testName]: {
 value: `{
    "relativeFilePath:fileHash": [
      [issueLine, issueColumn, length, issueMessage, issueHash]
      // ... more issues
    ],
    // ... more files
 }`
}
```

:::caution
`fileHash` and `issueHash` are used to track issues as the lines of code in a file change, or as the file moves around in the codebase. This means they change quite often! Check out [development workflow](./development-workflow) for suggested ways to handle this with source control.
:::
