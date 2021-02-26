---
id: config
title: Betterer Configuration
sidebar_label: Betterer Configuration
slug: /config
---

Whenever you run **Betterer** (from the [CLI](./running-betterer) or via the [JS API](./api)) you can pass an options object. It will be validated by **Betterer** and turned into a [`BettererConfig`](#bettererconfig).

## Betterer options

### Base options

```typescript
type BettererOptionsBase = Partial<{
  configPaths: BettererConfigPaths | string;
  cwd: string;
  filters: ReadonlyArray<string | RegExp> | string;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
}>;
```

#### `configPaths`: [`BettererConfigPaths`](#bettererconfigpaths) | `string` (default: `['./.betterer.ts]`)

> The list of [test definition file paths](./test-definition-file) containing **Betterer** tests for the current run.

#### `cwd`: `string` (default: [`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd))

> The current working directory for the current run.

#### `filters`: `ReadonlyArray<string | RegExp> | string` (default: `[]`)

> The list of filters which tests to run for the current run. Will be parsed into [`BettererConfigFilters`](#bettererconfigfilters).

#### `reporters`: [`BettererConfigReporters`](#bettererconfigreporters) (default: `['@betterer/reporter']`)

> The list of [reporters](./reporters) for the current run.

#### `resultsPath`: `string` (default: `'.betterer.results'`)

> The path to the [results file](./results-file) for the current run.

#### `silent`: `boolean` (default: `true`)

> When set to `true`, all default reporters will be disabled. Custom reporters will still work normally.

#### `tsconfigPath`: `string | null` (default: `null`)

> The path to the [TypeScript configuration](./betterer-and-typescript) for the current run.

### `BettererOptionsRunner`

Options object for creating a **Betterer** runner. It will be validated by **Betterer** and turned into a [`BettererConfig`](#bettererconfig).

```typescript
type BettererOptionsRunner = BettererOptionsBase &
  Partial<{
    ignores: BettererConfigIgnores;
  }>;
```

All the [`base options`](#base-options) above as well as:

#### `ignores`: [`BettererConfigIgnores`](#bettererconfigignores) (default: `[]`)

> The list of glob patterns to ignore from file watching for the current run.

### `BettererOptionsStart`

Options object for a **Betterer** run in default mode. It will be validated by **Betterer** and turned into a [`BettererConfig`](#bettererconfig).

```typescript
type BettererOptionsStart = BettererOptionsBase &
  Partial<{
    ci: boolean;
    strict: boolean;
    update: boolean;
    watch: boolean;
  }>;
```

All the [`base options`](#base-options) above as well as:

#### `ci`: `boolean` (default: `false`)

> When set to `true`, [CI mode](./running-betterer#ci-mode-run-your-tests-and-throw-on-changes) is enabled. In [CI mode] **Betterer** will throw an error if there is any difference between the test results and the expected results.

#### `strict`: `boolean` (default: `false`)

> When set to `true`, [Strict mode](./running-betterer#ci-mode-run-your-tests-and-throw-on-changes) is enabled. In [strict mode] **Betterer** will throw an error if there is any difference between the test results and the expected results. Set to `true` when `ci` is `true`.

#### `update`: `boolean` (default: `false`)

> When set to `true`, **Betterer** will [update the results file](./updating-results), even if things get worse. Set to `false` when `ci` or `strict` are `true`.

### `BettererOptionsWatch`

A input configuration for a **Betterer** run in Watch mode. Will be parsed into a [`BettererConfig`](#bettererconfig).

```typescript
export type BettererOptionsWatch = BettererOptionsRunner &
  Partial<{
    watch: true;
  }>;
```

All the [`base options`](#base-options) above as well as:

#### `ignores`: [`BettererConfigIgnores`](./config#bettererconfigignores) (default: `[]`)

> The list of glob patterns to ignore from file watching for the current run.

#### `watch`: `true`

> Must be set to `true` in [Watch mode](./running-betterer#watch-mode-run-your-tests-when-files-change). In [Watch mode] **Betterer** will run your tests any time a file changes.

## `BettererConfig`

A validated configuration object for a **Betterer** run:

```typescript
type BettererConfig = {
  ci: boolean;
  configPaths: BettererConfigPaths;
  cwd: string;
  filters: BettererConfigFilters;
  ignores: BettererConfigIgnores;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  strict: boolean;
  tsconfigPath: string | null;
  update: boolean;
  watch: boolean;
};
```

## `BettererConfigFilters`

A list of [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to filter which tests to run.

```typescript
type BettererConfigFilters = ReadonlyArray<RegExp>;
```

## `BettererConfigIgnores`

A list of [glob patterns](https://www.npmjs.com/package/glob#glob-primer) to ignore from file watching.

```typescript
type BettererConfigIgnores = ReadonlyArray<string>;
```

## `BettererConfigPaths`

A list of [test definition file paths](./test-definition-file) containing **Betterer** tests.

```typescript
type BettererConfigPaths = ReadonlyArray<string>;
```

## `BettererConfigReporter`

A path to a module that exports a [`BettererReporter`](./reporter#bettererreporter) or an inline [`BettererReporter`](./reporter#bettererreporter).

```typescript
type BettererConfigReporter = string | BettererReporter;
```

## `BettererConfigReporters`

A list of [`BettererConfigReporter`](#bettererconfigreporter).

```typescript
type BettererConfigReporter = ReadonlyArray<BettererConfigReporter>;
```
