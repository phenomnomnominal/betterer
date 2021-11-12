---
id: results-summary
title: Results summary
slug: /results-summary
---

If you just want to see a summary of the current results, you can run the `results` command.

## Results

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

Run `yarn betterer results` to get a summary of the current **Betterer** results.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer results` to get a summary of the current **Betterer** results.

  </TabItem>
</Tabs>

### Results options

You can pass the following options to `results`:

| Option                    | Description                                                         | Default               |
| ------------------------- | ------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [value]  | Path to test definition file relative to CWD. Takes multiple values | `./.betterer.ts`      |
| `--exclude` [value]       | RegExp filter for files to exclude. Takes multiple values           | `[]`                  |
| `-f`, `--filter` [value]  | Select tests to run by RegExp. Takes multiple values                | `[]`                  |
| `-r`, `--results` [value] | Path to test results file relative to CWD                           | `./.betterer.results` |
