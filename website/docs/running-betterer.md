---
id: running-betterer
title: Running Betterer
sidebar_label: Running Betterer
slug: /running-betterer
---

You can run **Betterer** with the **Betterer CLI**. If you used `npx @betterer/cli init` to add **Betterer** to your project, `@betterer/cli` will already be added as a dependency, and there will be a `betterer` script in your `package.json` file.

## Start mode (run your tests once)

If you just want to run your tests once (like before commiting your code), you can use `betterer start` or just `betterer`:

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

Run `yarn betterer start` or just `yarn betterer` to run **Betterer** once.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer start` or just `npm run betterer` to run **Betterer** once.

  </TabItem>
</Tabs>

<!-- prettier-ignore -->
<div className="video__container">
  <video loop autoPlay muted width="100%">
    <source src="/betterer/videos/start.mp4" type="video/mp4"/>
  </video>
</div>

**Betterer** will run your tests, compare the new results against the expected results, and report the updated status. If any test result is better, the [`.betterer.results`](./results-file) file will be updated with the new result ✅! If it gets worse, your test will fail and **Betterer** will throw an error ❌!

:::info
If it is your first time running **Betterer**, it will create a `.betterer.results` file! If you haven't added a test yet, the `.betterer.results` file will only contain the header comment.
:::

### Including and excluding files

If you want to test specific files, you can pass a file path or [glob](https://www.npmjs.com/package/glob#glob-primer) directly to the `start` command.

If you include files with a generic glob and want to exclude a specific file, you can use the [`--exclude`](./running-betterer#start-options) option, which can take multiple values. Each exclude pattern should be a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

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

Run `yarn betterer "src/**/*.js"` to run **Betterer** on all JavaScript files within `src`.

Run `yarn betterer "src/**/*.js" "src/**/*.css"` to run **Betterer** on all JavaScript and CSS files within `src`.

Run `yarn betterer "src/**/*.js" "src/**/*.css"--exclude excluded.js ` to run **Betterer** on all JavaScript and CSS files within `src`, but not any files called `excluded.js`.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer "src/**/*.js"` to run **Betterer** on all JavaScript files within `src`.

Run `npm run betterer "src/**/*.js" "src/**/*.css"` to run **Betterer** on all JavaScript and CSS files within `src`.

Run `npm run betterer "src/**/*.js" "src/**/*.css" --exclude excluded.js` to run **Betterer** on all JavaScript and CSS files within `src`, but not any files called `excluded.js`.

  </TabItem>
</Tabs>

:::warning
**Betterer** will only run [File Tests](./betterer-file-test) when targeting specific files.
:::

### Start options

You can also pass the following options to the `start` script:

| Option                     | Description                                                                 | Default                  |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------ |
| `-c`, `--config` [value]   | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`         |
| `-r`, `--results` [value]  | Path to test results file relative to CWD                                   | `./.betterer.results`    |
| `-t`, `--tsconfig` [value] | Path to TypeScript config file relative to CWD                              | `null`                   |
| `--exclude` [value]        | RegExp filter for files to exclude. Takes multiple values                   | `[]`                     |
| `-f`, `--filter` [value]   | Select tests to run by RegExp. Takes multiple values                        | `[]`                     |
| `-s`, `--silent`           | Disable all default reporters. Custom reporters still work normally.        | `false`                  |
| `-u`, `--update`           | Update the results file, even if things get worse                           | `false`                  |
| `--strict`                 | Hide the "how to update" message and set `--update` to `false`.             | `false`                  |
| `-R`, `--reporter` [value] | npm package name or file path to a Betterer reporter. Takes multiple values | `['@betterer/reporter']` |

### Read more about Start mode

- [The test definition file](./test-definition-file)
- [The results file](./results-file)
- [Betterer and TypeScript](./betterer-and-typescript)
- [Filters](./filters)
- [Updating results](./updating-results)
- [Reporters](./reporters)

## CI mode (run your tests and throw on changes)

If you just want to run your tests on your CI server (like as part of a build review process), you can use `betterer ci`:

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

Run `yarn betterer ci` to run **Betterer** in CI mode.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer ci` to run **Betterer** in CI mode.

  </TabItem>
</Tabs>

**Betterer** will run your tests, compare the new results against the expected results, and report the updated status. If there is a difference between the new results and the expected results **Betterer** will throw an error ❌.

### CI options

Same as [Start Options](#start-options)

### Read more about CI mode

- [Suggested development workflow](./development-workflow)

## Watch mode (run your tests when files change)

If you just want to run your tests each time your files change (like when working to fix a whole bunch of issues), you can use `betterer watch`:

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

Run `yarn betterer watch` to run **Betterer** in watch mode.

  </TabItem>
  <TabItem
    value="npm">

Run `npm run betterer watch` to run **Betterer** in watch mode.

  </TabItem>
</Tabs>

<!-- prettier-ignore -->
<div className="video__container">
  <video loop autoPlay muted width="100%">
    <source src="/betterer/videos/watch.mp4" type="video/mp4"/>
  </video>
</div>

### Watch mode controls

- Press `q` to quit
- Press `f` to modify filters
- Press `i` to modify ignores

**Betterer** will start watch mode, and wait for any files to change. When a file is saved, it will run any tests that apply to that file, compare the new results against the saved results, and report the updated status. When you quit watch mode (by pressing `q`), the [`.betterer.results`](./results-file) file will be updated with the new results ✅!

:::warning
When running in watch mode, **Betterer** will currently only run [File Tests](./betterer-file-test). This might change in the future, so please raise an issue with your use case!
:::

### Watch options

You can pass the following options to the `watch` script:

| Option                     | Description                                                                 | Default                  |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------ |
| `-c`, `--config` [path]    | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`         |
| `-r`, `--results` [path]   | Path to test results file relative to CWD                                   | `./.betterer.results`    |
| `-t`, `--tsconfig` [path]  | Path to TypeScript config file relative to CWD                              | `null`                   |
| `-f`, `--filter` [regexp]  | Select tests to run by RegExp. Takes multiple values                        | `[]`                     |
| `-s`, `--silent`           | Disable all default reporters. Custom reporters still work normally.        | `false`                  |
| `-i`, `--ignore` [glob]    | Ignore files by Glob when running in watch mode. Takes multiple values      | `[]`                     |
| `-R`, `--reporter` [value] | npm package name or file path to a Betterer reporter. Takes multiple values | `['@betterer/reporter']` |

### Ignoring files

If you want to ignore changes in certain files when running in [Watch mode](./running-betterer#watch-mode-run-your-tests-when-files-change), you can use the [`--ignore`](./running-betterer#watch-options) option, which can take multiple values. Each ignore pattern should be a [glob](https://www.npmjs.com/package/glob#glob-primer).

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

## Debug mode

If something isn't working correctly, it can be useful for debugging purposes to get a debug log. You can pass the following options to any of the run commands:

| Option                     | Description                                                                 | Default           |
| -------------------------- | --------------------------------------------------------------------------- | ----------------- |
| `-d`, `--debug`            | Enable debug mode. Also enables the `silent` flag to hide reporters output. | `false`           |
| `-l`, `--debug-log` [path] | Path to the debug log file.                                                 | `./.betterer.log` |
