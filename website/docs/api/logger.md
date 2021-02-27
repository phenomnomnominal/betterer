---
id: logger
title: Betterer logger
sidebar_label: Betterer logger
slug: /logger
---

## `BettererLogger`

The logging interface for **Betterer** reporter and task logging.

```typescript
type BettererLogger = {
  code: BettererLogCode;
  debug: BettererLogMessage;
  error: BettererLogMessage;
  info: BettererLogMessage;
  progress: BettererLogMessage;
  success: BettererLogMessage;
  warn: BettererLogMessage;
};
```

## `BettererLogMessage`

```typescript
type BettererLogMessage = (...messages: BettererLoggerMessages) => Promise<void>;
```

Args:

- `...messages`: [`BettererLoggerMessages`](#bettererloggermessages) - A list of messages to be logged.

Returns: `Promise<void>`

## `BettererLogCode`

```typescript
type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;
```

Args:

- `codeInfo`: [`BettererLoggerCodeInfo`](#bettererloggercodeinfo) - An object containing the data to render a code block with a message.

Returns: `Promise<void>`

## `BettererLoggerCodeInfo`

An object containing the data to render a code block with a message.

```typescript
type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};
```

## `BettererLoggerMessages`

A list of messages to be logged.

```typescript
type BettererLoggerMessages = Array<string>;
```
