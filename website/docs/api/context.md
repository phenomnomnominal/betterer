---
id: context
title: Betterer Context
sidebar_label: Betterer Context
slug: /context
---

## `BettererContext`

A `BettererContext` represents the lifecycle of a set of tests runs.

```typescript
type BettererContext = {
  readonly config: BettererConfig;
  readonly lifecycle: Promise<BettererSummaries>;
};
```

### Properties

#### `config`: [`BettererConfig`](./config#bettererconfig)

> The configuration for the current context

#### `lifecycle`: [`Promise<BettererSummaries>`](#betterersummaries)

> A promise that will resolve when the context ends.

## `BettererDelta`

A `BettererDelta` represents the change between a test runs and its baseline. A `BettererRun` has a `delta` property if the test has a [`progress`](./betterer-test#bettererprogress) handler.

```typescript
type BettererDelta =
  | {
      readonly baseline: number;
      readonly diff: number;
      readonly result: number;
    }
  | {
      readonly baseline: null;
      readonly diff: 0;
      readonly result: number;
    };
```

### Properties

#### `baseline`: `number | null`

> The baseline for the current test. Set when the context is created and will be constant across multiple runs. Set to `null` when it is a new test.

#### `diff`: `number | 0`

> The diff between the current test result and the baseline. Set to `0` when it is a new test.

#### `result`: `number`

> The current test result.

## `BettererRun`

```typescript
type BettererRun = {
  readonly diff: BettererDiff;
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths;
  readonly lifecycle: Promise<void>;
  readonly name: string;
  readonly delta: BettererDelta | null;
  readonly result: BettererResult;
  readonly test: BettererTestConfig;
  readonly timestamp: number;
  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isNew: boolean;
  readonly isSame: boolean;
  readonly isSkipped: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};
```

### Properties

#### `diff`: [`BettererDiff`](./betterer-test#bettererdiff)

> The verbose diff between the current test result and the expected reuslt.

#### `expected`: [`BettererResult`](./results#bettererresult)

> The expected result for this test run. Deserialised from the [results file](./results-file).

#### `filePaths`: [`BettererFilePaths`](./runner#bettererfilepaths)

> The list of [`BettererFilePaths`] that are being tested.

#### `lifecycle`: `Promise<void>`

> A promise that will resolve when the test run ends.

#### `name`: `string`

> The name of the run.

#### `delta`: [`BettererDelta`](#bettererdelta) | `null`

> The change between a test runs and its baseline. A `BettererRun` has a `delta` property if the test has a [`progress`](./betterer-test#bettererprogress) handler.

#### `result`: [`BettererResult`](./results#bettererresult)

> The current result for this test run. Will be serialised to the [results file](./results-file).

#### `test`: [`BettererTestConfig`](./betterer-test#betterertestconfig)

> The configuration for this test.

#### `timestamp`: `number`

> The time that the test started. Used for checking against a [test deadline](./tests#test-deadline).

### State

- `isBetter` - `result` is better than `expected`.
- `isComplete`- `result` has met the goal.
- `isExpired` - the test has passed its deadline.
- `isFailed` - the test threw an error.
- `isNew` - the test was run for the first time.
- `isSame` - `result` is the same as `expected`
- `isSkipped` - the test was skipped
- `isUpdated` - the test result was updated
- `isWorse` - `result` is worse than `expected

## `BettererRuns`

A list of [`BettererRun`](#bettererrun).

```
export declare type BettererRuns = ReadonlyArray<BettererRun>;
```

## `BettererRunNames`

A list of run names.

```typescript
type BettererRunNames = Array<string>;
```

## `BettererSummary`

```typescript
type BettererSummary = {
  readonly runs: BettererRuns;
  readonly result: string;
  readonly expected: string | null;
  readonly unexpectedDiff: boolean;
  readonly better: BettererRuns;
  readonly completed: BettererRuns;
  readonly expired: BettererRuns;
  readonly failed: BettererRuns;
  readonly new: BettererRuns;
  readonly ran: BettererRuns;
  readonly same: BettererRuns;
  readonly skipped: BettererRuns;
  readonly updated: BettererRuns;
  readonly worse: BettererRuns;
};
```

### Properties

#### `runs`: [`BettererRuns`](#bettererruns)

> The list of all runs.

#### `result`: `string`

> The serialised run results.

#### `expected`: `string | null`

> The serialised expected results. Will be `null` if it is the first time running **Betterer**.

#### `unexpectedDiff`: `boolean`

> Will be `true` if running in [CI mode](./running-betterer#ci-mode-run-your-tests-and-throw-on-changes) and `result` is not equal to `expected`

### State

#### `better`: [`BettererRuns`](#bettererruns)

> The list of runs that got better.

#### `completed`: [`BettererRuns`](#bettererruns)

> The list of runs that met their goals.

#### `expired`: [`BettererRuns`](#bettererruns)

> The list of runs that passed their deadlines.

#### `failed`: [`BettererRuns`](#bettererruns)

> The list of runs that threw errors.

#### `new`: [`BettererRuns`](#bettererruns)

> The list of runs that ran for the first time.

#### `ran`: [`BettererRuns`](#bettererruns)

> The list of runs that were run (not failed, or skipped).

#### `same`: [`BettererRuns`](#bettererruns)

> The list of runs that stayed the same.

#### `skipped`: [`BettererRuns`](#bettererruns)

> The list of runs that were skipped.

#### `updated`: [`BettererRuns`](#bettererruns)

> The list of runs that got worse, but were force updated.

#### `worse`: [`BettererRuns`](#bettererruns)

> The list of runs that got worse.

## `BettererSummaries`

A list of [`BettererSummary`](#betterersummary).

```typescript
type BettererSummaries = Array<BettererSummary>;
```
