---
id: upgrading
title: Upgrading
slug: /upgrading
---

There are some significant breaking changes between V4 and V5, so **Betterer** has a new `upgrade` command to help! This will be useful in the future if there are more breaking changes.

It can't upgrade _everything_ for you, but for not it will attempt to upgrade your [test definition file](./test-definition-file) to the new syntax so your tests can run in parallel.

## Upgrade

By default the `upgrade` command will not actually change anything. You can run it to check what would change, and then actually do the upgrade by passing the [`--save`](#upgrade-options) option

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

Run `yarn betterer upgrade` to upgrade your **Betterer** configuration.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer upgrade` to upgrade your **Betterer** configuration.

  </TabItem>
</Tabs>

### Upgrade options

You can pass the following options to `upgrade`:

| Option                   | Description                                                         | Default          |
| ------------------------ | ------------------------------------------------------------------- | ---------------- |
| `-c`, `--config` [value] | Path to test definition file relative to CWD. Takes multiple values | `./.betterer.ts` |
| `--save`                 | 'When present, Betterer will save the result of an upgrade to disk. | `false`          |
