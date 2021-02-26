---
id: api
title: Betterer API
description: JS API reference for Betterer
slug: /api
---

**Betterer** has a JavaScript API which can be used to start a run programatically.

## `betterer()`

Run **Betterer** with given options.

Usage:

```typescript
import { betterer } from '@betterer/betterer';

const summary = await betterer(options);
```

Args:

- `options`: [`BettererOptionsStart?`](./config#bettereroptionsstart)

Returns: [`BettererSummary`](./context#betterersummary)

## `betterer.watch()`

Create a **BettererRunner** with given options. Starts up a file watcher in the current directory.

Usage:

```typescript
import { betterer } from '@betterer/betterer';

const watcher = await betterer.watch(options);
```

Args:

- `options`: [`BettererOptionsRunner?`](./config#bettereroptionsrunner)

Returns: [`BettererRunner`](./runner#bettererrunner)

## `betterer.runner()`

Create a **BettererRunner** with given config.

Usage:

```typescript
import { betterer } from '@betterer/betterer';

const runner = await betterer.runner(options);
```

Args:

- `options`: [`BettererOptionsWatch?`](./config#bettereroptionswatch)

Returns: [`BettererRunner`](./runner#bettererrunner)
