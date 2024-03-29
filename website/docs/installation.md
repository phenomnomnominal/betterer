---
id: installation
title: Installation
sidebar_label: Installation
slug: /installation
---

## Prerequisites

You need at least [Node.js v12](https://nodejs.org/en/) to install and run **Betterer**.

## Adding **Betterer** to your project

The easiest way to get up and running with **Betterer** is to use the `init` script via `npx`:

```bash
# Run this from the root of your project:
npx @betterer/cli init
```

Running this command will:

1. Add `@betterer/cli` as a `devDependency` to your `package.json`
2. Add a `betterer` script to your `package.json`
3. Create a blank [`.betterer.ts`](./test-definition-file) file in the root of your project

:::caution
Running `npx @betterer/cli init` will modify your project's `package.json` file, so you probably want to make sure all your changes are saved first!
:::

### Init Options

You can pass the following options to the `init` script:

| Option                    | Description                                            | Default               |
| ------------------------- | ------------------------------------------------------ | --------------------- |
| `--automerge`             | Enable automatic merging for the Betterer results file | `false`               |
| `-c`, `--config` [path]   | Path to test definition file relative to CWD           | `./.betterer.ts`      |
| `-r`, `--results` [value] | Path to test results file relative to CWD              | `./.betterer.results` |

:::info
**Betterer** uses TypeScript by default! If you pass a `--config` path that ends with `.js`, JavaScript will be used instead and TypeScript will not be installed.
:::

### Read more about Init

- [The test definition file](./test-definition-file)
- [The results file](./results-file)

## Installing **Betterer** dependencies

You'll need to install the new dependency with your package manager of choice:

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

Run `yarn` to install `@betterer/cli`

  </TabItem>
  <TabItem
    value="npm">

Run `npm install` to install `@betterer/cli`

  </TabItem>
</Tabs>

## That's it!

You're all ready to go! 🎉
