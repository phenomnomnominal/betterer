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
  queue(filePaths?: BettererFilePaths): Promise<void>;
  stop(force: true): Promise<BettererSuiteSummary | null>;
  stop(): Promise<BettererSuiteSummary>;
};
```

### Methods

### `queue()`

Queue a **Betterer** test run on a given set of files. Multiple calls will be debounced.

Args:

- `filePaths?`: [`BettererFilePaths`](#bettererfilepaths) - List of files to test with **Betterer**. If `filePaths` is `undefined` then all files will be tested.

Returns: `Promise<void>`

### `stop()`

Stop the runner, and return the most recent [`BettererSuiteSummary`](./context#betterersuitesummary) (or `null` if a run hasn't finished yet`).

Args:

- `force?`: `true` - If `force` is passed, the **Betterer** run will be stopped and any errors will be ignored.

Returns: [`Promise<BettererSuiteSummary>`](./context#betterersuitesummary)
