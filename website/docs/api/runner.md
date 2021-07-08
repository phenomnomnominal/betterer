---
id: runner
title: Betterer Runner
sidebar_label: Betterer Runner
slug: /runner
---

## `BettererFilePaths`

A list of file paths.

```typescript
type BettererFilePaths = ReadonlyArray<string>;
```

## `BettererRunner`

```typescript
type BettererRunner = {
  queue(filePaths?: BettererFilePaths, handler?: BettererRunHandler): Promise<void>;
  stop(force: true): Promise<BettererSuiteSummary | null>;
  stop(): Promise<BettererSuiteSummary>;
};
```

### Methods

### `queue()`

Queue a **Betterer** test run on a given set of files. Multiple calls will be debounced.

Args:

- `filePaths?`: [`BettererFilePaths`](#bettererfilepaths) - List of files to test with **Betterer**. If `filePaths` is `undefined` then all files will be tested.
- `handler?`: [`BettererRunHandler`](#bettererrunhandler) - Callback to run when the queued run is complete.

Returns: `Promise<void>`

### `stop()`

Stop the runner, and return the most recent [`BettererSuiteSummary`](./context#betterersuitesummary) (or `null` if a run hasn't finished yet`).

Args:

- `force?`: `true` - If `force` is passed, the **Betterer** run will be stopped and any errors will be ignored.

Returns: [`Promise<BettererSuiteSummary>`](./context#betterersuitesummary)

## `BettererRunHandler`

```typescript
type BettererRunHandler = (suiteSummary: BettBettererSuiteSummaryererSummary) => void;
```

Args:

- `suiteSummary`: [`BettererSuiteSummary`](./context#betterersuitesummary) - The summary of the completed suite.

Returns: `void`
