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
  stop(force: true): Promise<BettererSummary | null>;
  stop(): Promise<BettererSummary>;
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

Stop the runner, and return the most recent [`BettererSummary`](./context#betterersummary) (or `null` if a run hasn't finished yet`).

Args:

- `force?`: `true` - If `force` is passed, the **Betterer** run will be stopped and any errors will be ignored.

Returns: [`Promise<BettererSummary>`](./context#betterersummary)

## `BettererRunHandler`

```typescript
type BettererRunHandler = (summary: BettererSummary) => void;
```

Args:

- `summary`: [`BettererSummary`](./context#betterersummary) - The summary of the completed run.

Returns: `void`
