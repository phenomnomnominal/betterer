---
id: updating-results
title: Updating results
sidebar_label: Updating results
slug: /updating-results
---

## Force update

By default **Betterer** will only update the results file when your test results improve. However, sometimes you need to ship something and don't have time to fix any regressions. In those cases it can be useful to force an update to the result file:

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

Run `yarn betterer -u` to run **Betterer** and force update the results.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer -u` to run **Betterer** and force update the results.

  </TabItem>
</Tabs>

:::caution
Whenever your test results get worse, **Betterer** will print a message explaining how to force update the results file. You can disable this message by passing `--strict` when you run **Betterer**.
:::
