---
id: development-workflow
title: Development workflow
sidebar_label: Development workflow
slug: /development-workflow
---

You should think carefully about how you want to use **Betterer** in your workflow. There is not a perfect "one-size-fits-all" workflow for all teams, but here's a few pointers:

- Commit the results file (e.g. `.betterer.results`) to source control. You should think of this file like a [Jest Snapshot file](https://jestjs.io/docs/en/snapshot-testing), and review any changes carefully.

- You should **Betterer** as part of a build pipeline along with other static analysis tools and tests.

- If **Betterer** runs in a pre-commit hook, remember to commit any changes to the results file. That might look something like:

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

```bash
yarn betterer && git add .betterer.results
```

  </TabItem>
  <TabItem
    value="npm">

```bash
npm run betterer && git add .betterer.results
```

  </TabItem>
</Tabs>

- You should run **Betterer** in CI mode ([`betterer ci`](./running-betterer#ci-mode-run-your-tests-and-throw-on-changes)) when running on a build server. When **Betterer** runs in CI mode, it will throw an error when the tests results do not exactly match whatever is in the results file. This ensures that the results file accurately reflects the state of the codebase.
