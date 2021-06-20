---
id: betterer-file-test
title: Betterer File Test
description: Betterer File Test API reference
slug: /betterer-file-test
---

## `BettererFileTest`

One very common usecase for **Betterer** is to track issues across all the files in a project. `BettererFileTest` provides a wrapper around [`BettererTest`](./betterer-test#betterertest) that makes it easier to implement such a test. It also provides a useful example for the more complex possibilities of the [`BettererTestOptions`](./betterer-test#betterertestoptions) interface

```typescript
class BettererFileTest
  constructor(fileTest: BettererFileTestFunction);
  exclude(...excludePatterns: BettererFilePatterns): this;
  include(...includePatterns: BettererFileGlobs): this;
}
```

### Constructor

Args:

- `fileTest`: [`BettererFileTestFunction`](#bettererfiletestfunction)

#### Usage

```typescript
import { BettererFileTest } from '@betterer/betterer';

const test = new BettererFileTest((filePaths, fileTestResult) => {
  // test code here:
  // get issues for each file and add them to the fileTestResult
});
```

### Properties

All the properties from [`BettererTest`](./betterer-test#betterertest).

### Methods

All the methods from [`BettererTest`](./betterer-test#betterertest) and:

### `include()`

Add a list of glob patterns for files to include when running the test.

Args:

- `...includePatterns`: [`BettererFileGlobs`](#bettererfileglobs)

Returns: [`BettererFileTest`](#bettererfiletest)

### `exclude()`

A list of RegExp filters for files to exclude when running the test.

Args:

- `...excludePatterns`: [`BettererFilePatterns`](#bettererfilepatterns)

Returns: [`BettererFileTest`](#bettererfiletest)

## `BettererFileTestFunction`

A function that runs an actual file test.

```typescript
export declare type BettererFileTestFunction = (
  filePaths: BettererFilePaths,
  fileTestResult: BettererFileTestResult
) => MaybeAsync<void>;
```

Args:

- `filePaths`: [`BettererFilePaths`](./runner#bettererfilepaths) - A list of file paths that will be checked.
- `fileTestResult`: [`BettererFileTestResult`](#bettererfiletestresult) -

Returns: `Promise<void>` | `void`

## `BettererFileTestResult`

[`DeserialisedType`](./betterer-test#deseriliasedtype-default-unknown) of a [`BettererFileTest`](#bettererfiletest). It is a set of [`BettererFile`](#bettererfile)s which each have their own set of [`BettererFileIssues`](#bettererfileissues).

```typescript
type BettererFileTestResult = {
  addFile(absolutePath: string, fileText: string): BettererFile;
  getIssues(absolutePath: string): BettererFileIssues;
};
```

### Methods

### `addFile()`

Add a new file to the result set.

Args:

- `absolutePath`: `string` - The absolute path to the file.
- `fileText`: `string` - The current text content of the file.

Returns: [`BettererFile`](#bettererfile)

### `getIssues()`

Get the set of [`BettererFileIssues`](#bettererfileissues) for a file at the given path.

Args:

- `absolutePath`: `string` - The absolute path to the file.

Returns: [`BettererFileIssues`](#bettererfileissues)

## `BettererFileBase`

A part of the [`SerialisedType`](./betterer-test#serialisedtype-default-deserialisedtype) of a [`BettererFileTestResult`](#bettererfiletestresult).

```typescript
type BettererFileBase = {
  readonly absolutePath: string;
  readonly hash: string;
  readonly issues: BettererFileIssues;
  readonly key: string;
};
```

### Properties

#### `absolutePath`: `string`

> The absolute path to the file.

#### `hash`: `string`

> The hash for the file (usually the hash of the file contents). The `hash` is used for tracking files as they move around within a codebase.

#### `issues`: [`BettererFileIssues`](#bettererfileissues)

> The set of issues for the file.

#### `key`: `string`

> The key used for identifying the file in the [results file](./results-file)

## `BettererFile`

A part of the [`DeserialisedType`](./betterer-test#deserialisedtype-default-unknown) of a [`BettererFileTestResult`](#bettererfiletestresult).

```typescript
type BettererFile = BettererFileBase & {
  addIssue(start: number, end: number, message: string, hash?: string): void;
  addIssue(line: number, col: number, length: number, message: string, hash?: string): void;
  addIssue(startLine: number, startCol: number, endLine: number, endCol: number, message: string, hash?: string): void;
};
```

### Properties

All the properties from [`BettererFileBase`](#bettererfilebase).

### Methods

### `addIssue()`

Add a new issue to the file. Three different overloaded versions to handle common structures from libraries.

Returns: `void`

## `BettererFileGlobs`

A list of glob patterns for files to include when running a [`BettererFileTest`](#bettererfiletest).

```typescript
type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
```

## `BettererFilePatterns`

A list of RegExp filters for files to exclude when running a [`BettererFileTest`](#bettererfiletest).

```typescript
type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;
```

## `BettererFileDiff`

A diff object for a single file

```typescript
type BettererFileDiff = {
  fixed?: BettererFileIssues;
  existing?: BettererFileIssues;
  new?: BettererFileIssues;
};
```

### Properties

#### `fixed`: [`BettererFileIssues`](#bettererfileissues)

> The list of issues that have been fixed since the last run

#### `existing`: [`BettererFileIssues`](#bettererfileissues)

> The list of issues that have not changed since the last run

#### `new`: [`BettererFileIssues`](#bettererfileissues)

> The list of new issues since the last run

## `BettererFilesDiff`

A map from file path to [`BettererFileDiff`](#bettererfilediff).

```typescript
type BettererFilesDiff = Record<string, BettererFileDiff>;
```

## `BettererFileTestDiff`

A diff object for a complete [`BettererFileTest`](#bettererfiletest) run.

```typescript
type BettererFileTestDiff = BettererDiff<BettererFileTestResult, BettererFilesDiff>;
```

## `BettererFileIssue`

A object that describe an issue in a file.

```typescript
type BettererFileIssue = {
  readonly line: number;
  readonly column: number;
  readonly length: number;
  readonly message: string;
  readonly hash: string;
};
```

### Properties

#### `line`: `number`

> The line number in the file that has an issue

#### `column`: `number`

> The column number in the line that has an issue

#### `length`: `number`

> The number of characters that cover the issue

#### `message`: `string`

> A message that describes the issue

#### `hash`: `string`

> A hash for the issue (usually the hash of the `message`). The `hash` is used for tracking issues as they move around within a file.

## `BettererFileIssues`

A list of [`BettererFileIssue`](#bettererfileissue)

```typescript
type BettererFileIssues = ReadonlyArray<BettererFileIssue>;
```
