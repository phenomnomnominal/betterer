---
id: results-file
title: Results file
sidebar_label: Results file
slug: /results-file
---

All your test results will be saved in a results file. By default, **Betterer** sets this to be `.betterer.results`, but you can change that by using the [`--results`](./running-betterer#start-options) option when running **Betterer**.

The results file is similar to a [Jest Snapshot file](https://jestjs.io/docs/en/snapshot-testing). It should be [commited along with your code](./workflow) and probably shouldn't be [updated](./updating-results) manually (although you of course can if you're feeling confident!).

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

This is a valid JavaScript file, so you can import it and manipulate it if you need to. Each test will have an object that stores its result value, which can be controlled by a tests [`serialiser`](./betterer.bettererserialiser) and [`printer`](./betterer.bettererprinter) options.

When your tests run, **Betterer** will check to see the result against the expected result in the results file. If the new result is better, the results file will be updated, and that result will be the expected baseline going forward.

### [`BettererFileTest`](./betterer.bettererfiletest) results

The above example comes from a [`BettererFileTest`](./betterer.bettererfiletest), which has some note-worthy details. A [`BettererFileTest`](./betterer.bettererfiletest) result has the following format:

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
`fileHash` and `issueHash` are used to track issues as the lines of code in a file change, or as the file moves around in the codebase. This means they change quite often! Check out the [workflow guide](./workflow) for suggested ways to handle this with source control.
:::

## Merge

If you are working in a codebase where there is a lot of changes, you may encounter merge conflicts in the results file. It is possible to resolve these manually, but it is much easier to let **Betterer** handle merging for you!

The `merge` command does a fairly naive merge of the results file.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore -->
<Tabs
  groupId="package-manager"
  defaultValue="yarn"
  values={[
    { label: 'Yarn', value: 'yarn' },
    { label: 'npm', value: 'npm' },
  ]}>
  <TabItem
    value="yarn">

Run `yarn betterer merge` to automatically merge the **Betterer** results file.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer merge` to automatically merge the **Betterer** results file.

  </TabItem>
</Tabs>

### Merge options

You can pass the following options to `merge`:

| Option                    | Description                               | Default               |
| ------------------------- | ----------------------------------------- | --------------------- |
| `-r`, `--results` [value] | Path to test results file relative to CWD | `./.betterer.results` |

### Automerge

If you don't ever want to have to think about merging the results file, you can enable automatic merging. Run [`betterer init`](installation) with the [`--automerge`](./installation#init-options). **Betterer** will update your git configuration to always run `betterer merge` whenever there is a conflict in the results file.

:::caution
Automerge is still experimental. Please try it out and [create issues on Github](https://github.com/phenomnomnominal/betterer/issues) if anything is weird. If something is broken, you can just delete the Betterer merge config from the `.gitattributes` file.
:::
