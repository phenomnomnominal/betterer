---
id: running-betterer
title: Running Betterer
sidebar_label: Running Betterer
slug: /running-betterer
---

You can run **Betterer** with the **Betterer CLI**. If you used `npx @betterer/cli init` to add **Betterer** to your project, `@betterer/cli` will already be added as a dependency, and there will be a `betterer` script in your `package.json` file.

## Default mode (run your tests once)

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
    <source src="/static/videos/start.mp4" type="video/mp4"/>
  </video>
</div>

**Betterer** will run your tests, compare the new results against the expected results, and report the updated status. If any test result is better, the `.betterer.results` file will be updated with the new result ✅! If it gets worse, your test will fail and **Betterer** will throw an error ❌!

:::info
If it is your first time running **Betterer**, it will create a `.betterer.results` file! If you haven't added a test yet, the `.betterer.results` file will only contain the header comment.
:::

### Start options

You can pass the following options to the `start` script:

| Option                           | Description                                                                 | Default               |
| -------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [path]          | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`      |
| `-r`, `--results` [path]         | Path to test results file relative to CWD                                   | `./.betterer.results` |
| `-t`, `--tsconfig` [path]        | Path to TypeScript config file relative to CWD                              | `null`                |
| `-f`, `--filter` [regexp]        | Select tests to run by RegExp. Takes multiple values                        | `[]`                  |
| `-s`, `--silent` [true or false] | Disable all default reporters. Custom reporters still work normally         | `false`               |
| `-u`, `--update` [true or false] | Force update the results file, even if things get worse                     | `false`               |
| `--allow-update` [true or false] | Allow updating via the `--update` flag                                      | `true`                |
| `-R`, `--reporter` [value]       | npm package name or file path to a Betterer reporter. Takes multiple values | Default reporter      |

### Read more about Start mode

- [The test definition file](./test-definition-file)
- [The results file](./results-file)
- [Betterer and TypeScript](./betterer-and-typescript)
- [Filters](./filters-and-ignores#filters)
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

| Option                           | Description                                                                 | Default               |
| -------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [path]          | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`      |
| `-r`, `--results` [path]         | Path to test results file relative to CWD                                   | `./.betterer.results` |
| `-t`, `--tsconfig` [path]        | Path to TypeScript config file relative to CWD                              | `null`                |
| `-f`, `--filter` [regexp]        | Select tests to run by RegExp. Takes multiple values                        | `[]`                  |
| `-s`, `--silent` [true or false] | Disable all default reporters. Custom reporters still work normally         | `false`               |
| `-R`, `--reporter` [value]       | npm package name or file path to a Betterer reporter. Takes multiple values | Default reporter      |

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
    <source src="/static/videos/watch.mp4" type="video/mp4"/>
  </video>
</div>

### Watch mode controls

- Press `q` to quit
- Press `f` to modify filters
- Press `i` to modify ignores

**Betterer** will start watch mode, and wait for any files to change. When a file is saved, it will run any tests that apply to that file, compare the new results against the saved results, and report the updated status. When you quit watch mode (by pressing `q`), the `.betterer.results` file will be updated with the new results ✅!

:::info
When running in watch mode, **Betterer** will currently only run [File Tests](./file-test). This might change in the future, so please raise an issue with your use case!
:::

### Watch options

You can pass the following options to the `watch` script:

| Option                           | Description                                                                 | Default               |
| -------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| `-c`, `--config` [path]          | Path to test definition file relative to CWD. Takes multiple values         | `./.betterer.ts`      |
| `-r`, `--results` [path]         | Path to test results file relative to CWD                                   | `./.betterer.results` |
| `-t`, `--tsconfig` [path]        | Path to TypeScript config file relative to CWD                              | `null`                |
| `-f`, `--filter` [regexp]        | Select tests to run by RegExp. Takes multiple values                        | `[]`                  |
| `-s`, `--silent` [true or false] | Disable all default reporters. Custom reporters still work normally.        | `false`               |
| `-i`, `--ignore` [glob]          | Ignore files by Glob when running in watch mode. Takes multiple values      | `[]`                  |
| `-R`, `--reporter` [value]       | npm package name or file path to a Betterer reporter. Takes multiple values | Default reporter      |

### Read more about Watch mode

- [Filters and Ignores](./filters-and-ignores)
