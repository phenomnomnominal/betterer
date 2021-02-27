---
id: reporter
title: Betterer Reporter
sidebar_label: Betterer Reporter
slug: /reporter
---

## `BettererReporter`

The interface to the **Betterer** [reporter system](./reporters) for hooking into the test runner.

```typescript
type BettererReporter = {
  configError?(config: unknown, error: BettererError): Promise<void> | void;
  contextStart?(context: BettererContext, lifecycle: Promise<BettererSummaries>): Promise<void> | void;
  contextEnd?(context: BettererContext, summaries: BettererSummaries): Promise<void> | void;
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  runsStart?(runs: BettererRuns, filePaths: BettererFilePaths): Promise<void> | void;
  runsEnd?(summary: BettererSummary, filePaths: BettererFilePaths): Promise<void> | void;
  runStart?(run: BettererRun, lifecycle: Promise<void>): Promise<void> | void;
  runEnd?(run: BettererRun): Promise<void> | void;
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};
```

## Config hooks

### `configError()`

The `configError()` hook is called when there is an error while validating and instantiating a [`BettererConfig`](./config#bettererconfig)

Args:

- `config`: [`unknown`] - The invalid config object.
- `error`: [`BettererError`](./error#betterererror) - The error thrown while validating and instantiating the [`BettererConfig`](./config#bettererconfig).

Returns: `Promise<void> | void`

## Context hooks

### `contextStart()`

The `contextStart()` hook is called when a [`BettererContext`](./context#betterercontext) starts. The `lifecycle` promise will resolve when the context ends, so it can be used instead of the [`contextEnd()`](#contextend) and [`contextError()`](#contexterror) hooks.

Args:

- `context`: [`BettererContext`](./context#betterercontext) - The current test context.
- `lifecycle`: [`Promise<BettererSummaries>`](./context#betterersummaries) - A promise that will resolve when the context ends.

Returns: `Promise<void> | void`

### `contextEnd()`

The `contextEnd()` hook is called when a [`BettererContext`](./context#betterercontext) ends.

Args:

- `context`: [`BettererContext`](./context#betterercontext) - The current test context.
- `summaries`: [`BettererSummaries`](./context#betterersummaries) - A list of [`BettererSummaries`], one for each run completed by the context.

Returns: `Promise<void> | void`

### `contextError()`

The `contextError()` hook is called when there is an error running a context.

Args:

- `context`: [`BettererContext`](./context#betterercontext) - The current test context.
- `error`: [`BettererError`](./error#betterererror) - The error thrown while running the context.

## Runs hooks

### `runsStart()`

The `runsStart()` hook is called when a [`BettererContext`](./context#betterercontext) starts a new set of test runs.

Args:

- `runs`: [`BettererRuns`](./context#bettererruns) - A list of [`BettererRuns`] that will be run.
- `filePaths`: [`BettererFilePaths`](./runner#bettererfilepaths) - A list of [`BettererFilePaths`] that will be checked.

Returns: `Promise<void> | void`

### `runsEnd()`

The `runsEnd()` hook is called when a [`BettererContext`](./context#betterercontext) ends a set of test runs.

Args:

- `summary`: [`BettererSummary`](./context#betterersummary) - A [`BettererSummary`] for the completed test run.
- `filePaths`: [`BettererFilePaths`](./runner#bettererfilepaths) - A list of [`BettererFilePaths`] that were checked.

Returns: `Promise<void> | void`

## Run hooks

### `runStart()`

The `runStart()` hook is called when a [`BettererRun`](./context#bettererrun) starts. The `lifecycle` promise will resolve when the test run ends, so it can be used instead of the [`runEnd()`](#runend) and [`runError()`](#runerror) hooks.

Args:

- `run`: [`BettererRun`](./context#bettererrun) - The current test run.
- `lifecycle`: `Promise<void>` - A promise that will resolve when the test run ends.

Returns: `Promise<void> | void`

### `runEnd()`

The `runEnd()` hook is called when a [`BettererRun`](./context#bettererrun) ends.

Args:

- `run`: [`BettererRun`](./context#bettererrun) - The current test run.

Returns: `Promise<void> | void`

### `runError()`

The `runError()` hook is called when there is an error running a test.

Args:

- `run`: [`BettererRun`](./context#bettererrun) - The current test run.
- `error`: [`BettererError`](./error#betterererror) - The error thrown while running the test.
