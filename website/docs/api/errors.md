---
id: errors
title: Betterer errors
sidebar_label: Betterer errors
slug: /error
---

## `BettererError`

A **BettererError** is a custom Error for use in **Betterer**. It attaches some extra details to a standard JavaScript error for better logging and debugging.

```typescript
import { BettererError } from '@betterer/errors';

const error = new BettererError(`Something went wrong: "OOPS!"`, new Error('Something broke'), 'More details!');
```

## `BettererErrorDetail`

Extra detail to attach to an error.

```typescript
type BettererErrorDetail = string | Error | BettererError;
```

## `BettererErrorDetails`

A list of [`BettererErrorDetail`](#betterererrordetail).

```typescript
type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;
```

## `isBettererError()`

Check if an object is a [`BettererError`](#betterererror).

Usage:

```typescript
import { BettererError, isBettererError } from '@betterer/errors';

isBettererError(new Error()); // false
isBettererError(new BettererError()); // true
```
