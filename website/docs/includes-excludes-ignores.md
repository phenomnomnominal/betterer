---
id: includes-excludes-ignores
title: Includes, Excludes & Ignores
sidebar_label: Includes, Excludes & Ignores
slug: /includes-excludes-ignores
---

## Includes and Excludes

If you want to target specific files, you can use the [`--include`](./running-betterer#start-options) option, which can take multiple values. Each ignore pattern should be a [glob](https://www.npmjs.com/package/glob#glob-primer).

If you want to exclude specific included files, you can use the [`--exclude`](./running-betterer#start-options) option, which can take multiple values. Each exclude pattern should be a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

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

Run `yarn betterer --include src/**/*.js` to run **Betterer** on all JavaScript files within `src`.

Run `yarn betterer --include src/**/*.js --include src/**/*.css` to run **Betterer** on all JavaScript and CSS files within `src`.

Run `yarn betterer --include src/**/*.js --include src/**/*.css --exclude excluded.js` to run **Betterer** on all JavaScript and CSS files within `src`, but not any files called `excluded.js`.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer --include src/**/*.js` to run **Betterer** on all JavaScript files within `src`.

Run `npm run betterer --include src/**/*.js --include src/**/*.css` to run **Betterer** on all JavaScript and CSS files within `src`.

Run `npm run betterer --include src/**/*.js --include src/**/*.css --exclude excluded.js` to run **Betterer** on all JavaScript and CSS files within `src`, but not any files called `excluded.js`.

  </TabItem>
</Tabs>

:::warning
**Betterer** will only run [File Tests](./betterer-file-test) when `--include` is used.
:::

## Ignores

If you want to ignore changes in certain files when running in [Watch mode](./running-betterer#watch-mode-run-your-tests-when-files-change), you can use the [`--ignore`](./running-betterer#watch-options) option, which can take multiple values. Each ignore pattern should be a [glob](https://www.npmjs.com/package/glob#glob-primer).

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

Run `yarn betterer watch --ignore **/*.js` to run **Betterer** with an ignore.

Run `yarn betterer watch --ignore "**/*.js" --ignore "**/*.css"` to run **Betterer** with multiple ignores.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer watch --ignore **/*.js` to run **Betterer** with an ignore.

Run `npm run betterer watch --ignore "**/*.js" --ignore "**/*.css"` to run **Betterer** with multiple ignores.

  </TabItem>
</Tabs>

:::info
When running in [Watch mode](./running-betterer#watch-mode-run-your-tests-when-files-change), ignores can be updated on the fly by first pressing `i`, and then modifying the current ignore.
:::
