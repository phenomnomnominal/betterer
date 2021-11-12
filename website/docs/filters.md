---
id: filters
title: Filters
sidebar_label: Filters
slug: /filters
---

If you want to be selective about which tests run, you can use the [`--filter`](./running-betterer#start-options) option, which can take mutliple values. Each filter should be a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

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

Run `yarn betterer --filter my-test` to run **Betterer** with a filter.

Run `yarn betterer --filter my-test --filter my-other-test` to run **Betterer** with multiple filters.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer --filter my-test` to run **Betterer** with a filter.

Run `npm run betterer --filter my-test --filter my-other-test` to run **Betterer** with multiple filters.

  </TabItem>
</Tabs>

When running in [Watch mode](./running-betterer#watch-mode), filters can be updated on the fly by first pressing `f`, and then modifying the current filter.
