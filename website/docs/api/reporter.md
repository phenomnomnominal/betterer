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
  contextStart?(context: BettererContext, lifecycle: Promise<BettererContextSummary>): Promise<void> | void;
  contextEnd?(contextSummary: BettererContextSummary): Promise<void> | void;
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  suiteStart?(suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>): Promise<void> | void;
  suiteEnd?(suiteSummary: BettererSuiteSummaries, filePaths: BettererFilePaths): Promise<void> | void;
  runStart?(run: BettererRun, lifecycle: Promise<void>): Promise<void> | void;
  runEnd?(run: BettererRun): Promise<void> | void;
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};
```

## Config hooks

### `configError()`

The `configError()` hook is called when there is an error while validating and instantiating a [`BettererConfig`](./config#bettererconfig).

Args:

- `config`: [`unknown`] - The invalid config object.
- `error`: [`BettererError`](./errors#betterererror) - The error thrown while validating and instantiating the [`BettererConfig`](./config#bettererconfig).

Returns: `Promise<void> | void`

## Context hooks

### `contextStart()`

The `contextStart()` hook is called when a [`BettererContext`](./context#betterercontext) starts. The `lifecycle` promise will resolve when the context ends or reject when the context errors, so it can be used instead of the [`contextEnd()`](#contextend) and [`contextError()`](#contexterror) hooks.

Args:

- `context`: [`BettererContext`](./context#betterercontext) - The current test context.
- `lifecycle`: [`Promise<BettererContextSummary>`](./context#betterercontextsummarry) - A promise that will resolve when the context ends or reject when the context errors.

Returns: `Promise<void> | void`

### `contextEnd()`

The `contextEnd()` hook is called when a [`BettererContext`](./context#betterercontext) ends.

Args:

- `contextSummary`: [`BettererContextSummary`](./context#betterercontextsummary) - The current test context.

Returns: `Promise<void> | void`

### `contextError()`

The `contextError()` hook is called when there is an error running a context.

Args:

- `context`: [`BettererContext`](./context#betterercontext) - The current test context.
- `error`: [`BettererError`](./errors#betterererror) - The error thrown while running the context.

## Runs hooks

### `suiteStart()`

The `suiteStart()` hook is called when a [`BettererContext`](./context#betterercontext) starts a new suite of test runs.

Args:

- `suite`: [`BettererSuite`](./context#betterersuite) - A [`BettererSuite`](./context#betterersuite).
- `lifecycle`: `Promise<BettererSuiteSummary>` - A promise that will resolve when the suite run ends, or reject when the suite run throws.

Returns: `Promise<void> | void`

### `suiteEnd()`

The `suiteEnd()` hook is called when a [`BettererContext`](./context#betterercontext) ends a suite of test runs.

Args:

- `suiteSummary`: [`BettererSuiteSummaries`](./context#betterersuitesummary) - A [`BettererSuiteSummaries`](./context#betterersuitesummary) for the completed test run.

Returns: `Promise<void> | void`

## Run hooks

### `runStart()`

The `runStart()` hook is called when a [`BettererRun`](./context#bettererrun) starts. The `lifecycle` promise will resolve when the test run ends or reject when the test run throws, so it can be used instead of the [`runEnd()`](#runend) and [`runError()`](#runerror) hooks.

Args:

- `run`: [`BettererRun`](./context#bettererrun) - The current test run.
- `lifecycle`: `Promise<BettererRunSummary>` - A promise that will resolve when the test run ends, or reject when the test run throws.

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
- `error`: [`BettererError`](./errors#betterererror) - The error thrown while running the test.
