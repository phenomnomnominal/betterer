---
id: betterer-test
title: Betterer Test
description: Betterer Test API reference
slug: /betterer-test
---

## `BettererTestOptions`

Whenever you create a [`BettererTest`](#betterertest) you can pass an options object. It will be validated by and turned into a [`BettererTestConfig`](#betterertestconfig).

There is a lot of power (and therefore complexity) in this options object. The types should hopefully guide you towards a useful test, but feel free to reach out if you need help!

```typescript
type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> =
  | BettererTestOptionsBasic
  | BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;
```

### Generics

#### `DeserialisedType` (default `unknown`)

This type describes the basic result type of a test. For simple tests this can just be a `number` or other primitive. More complex types can be used, but will possibly require implementing [`differ`](#bettererdiffer), [`serialiser`](#bettererserialiser), and [`printer`](#bettererprinter).

#### `SerialisedType` (default `DeserialisedType`)

This type describes the serialised type of a test result. Some complex result types (like [`BettererFileTestResult`](./file-test#bettererfiletestresult)) cannot be directly serialised to JSON, so it must be converted to a serailisable form.

#### `DiffType` (default `null`)

This type describes the diff between two results. Some complex result types (like [`BettererFileTestResult`](./file-test#bettererfiletestresult)) cannot be compared directly, so a diff can be constructed to better express the comparison.

## `BettererTestOptionsBasic`

The least complex version of a [`BettererTest`](#betterertest) operates on simple numbers and can be defined with just a few properties.

```typescript
type BettererTestOptionsBasic = {
  constraint: BettererTestConstraint<number>;
  test: BettererTestFunction<number>;
  goal?: BettererTestGoal<number> | number;
  deadline?: Date | string;
};
```

### Properties

#### `constraint`: [`BettererTestConstraint`](#betterertestconstraint)

> The constraint function for the test.

#### `test`: [`BettererTestFunction`](#betterertestfunction)

> The function that runs the actual test.

#### `goal`: [`BettererTestGoal`](#betterertestgoal) | `number`

> The goal function or value for the test.

#### `deadline`: `Date` | `string`

> The deadline for the test.

## `BettererTestOptionsComplex`

For a more complex version [`BettererTest`](#betterertest) that operates on more complex objects, you may need to define more copmlex behaviour.

```typescript
type BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer?: BettererPrinter<SerialisedType>;
  progress?: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  goal: BettererTestGoal<DeserialisedType> | DeserialisedType;
  deadline?: Date | string;
};
```

### Properties

#### `constraint`: [`BettererTestConstraint`](#betterertestconstraint)

> The constraint function for the test.

#### `test`: [`BettererTestFunction`](#betterertestfunction)

> The function that runs the actual test.

#### `differ`: [`BettererDiffer`](#bettererdiffer)

> The function that compares two test results.

#### `printer`: [`BettererPrinter`](#bettererprinter)

> The function that converts a serialised test result to the string that will be saved in the [test results file](./results-file)

#### `progress`: [`BettererProgress`](#bettererprogress)

> The function that converts a test result to a number value that represents the progress towards the goal.

#### `serialiser`: [`BettererSerialiser`](#bettererserialiser)

> The functions that serialises and deserialises a test result between the [`DeserialisedType`](#deserialisedtype-default-unknown) and [`SerialisedType`](#serialisedtype-default-deserialisedtype).

#### `goal`: [`BettererTestGoal`](#betterertestgoal) | `number`

> The goal function or value for the test.

#### `deadline`: `Date` | `string`

> The deadline for the test.

## `BettererTest`

The interface to the **Betterer** [test system](./tests).

```typescript
class BettererTest {
  get config(): BettererTestConfig;
  get isOnly(): boolean;
  get isSkipped(): boolean;
  constructor(options: BettererTestOptions);
  only(): this;
  skip(): this;
}
```

### Constructor

Args:

- `options`: [`BettererTestOptions`](#betterertestoptions)

#### Usage

```typescript
import { BettererTest } from '@betterer/betterer';

const test = new BettererTest({ ... });
```

### Properties

#### `config`: [`BettererTestConfig`](#betterertestconfig)

> The complete configuration for the test.

#### `isOnly`: `boolean`

> Calling `only()` will mark this as `true`. If this is `true` all other tests will be skipped.

#### `isSkipped`: `boolean`

> Calling `skip()` will mark this as `true`. If this is `true` this test will be skipped.

### Methods

### `only()`

Run only this test. All other tests will be marked as skipped.

Returns: [`BettererTest`](#betterertest)

### `skip()`

Skip this test.

Returns: [`BettererTest`](#betterertest)

## `BettererTestConfig`

The validated configuration for a [`BettererTest`](#betterertest)

```typescript
type BettererTestConfig<DeserialisedType, SerialisedType, DiffType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline: number;
  goal: BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  progress: BettererProgress<DeserialisedType> | null;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  type: BettererTestType;
};
```

## `BettererTestConstraint`

A function that checks if a test result is [`better`, `worse`, or the `same`](./constraint#bettererconstraintresult).

```typescript
type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => Promise<BettererConstraintResult> | BettererConstraintResult;
```

Args:

- `result`: [`DeserialisedType`](#deserialisedtype-default-unknown) - Result from the current test run.
- `expected`: [`DeserialisedType`](#deserialisedtype-default-unknown) - Expected result from the results file.

Returns: [`Promise<BettererConstraintResult>`](./constraint#bettererconstraintresult) | [`BettererConstraintResult`](./constraint#bettererconstraintresult)

## `BettererTestFunction`

A function that runs the actual test.

```typescript
type BettererTestFunction<DeserialisedType> = (run: BettererRun) => Promise<DeserialisedType> | DeserialisedType;
```

Args:

- `run`: [`BettererRun`](./context#bettererrun) - The current run.

Returns: [`Promise<DeserialisedType>`](#deserialisedtype-default-unknown) | [`DeserialisedType`](#deserialisedtype-default-unknown)

## `BettererTestGoal`

A function that returns whether the test has met its goal.

```typescript
type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => Promise<boolean> | boolean;
```

Args:

- `result`: [`DeserialisedType`](#deserialisedtype-default-unknown) - The current result.

Returns: `Promise<boolean>` | `boolean`

## `BettererDiffer`

A function that compares two test results.

```typescript
type BettererDiffer<DeserialisedType, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => BettererDiff<DeserialisedType, DiffType>;
```

Args:

- `expected`: [`DeserialisedType`](#deserialisedtype-default-unknown) - The expected result.
- `result`: [`DeserialisedType`](#deserialisedtype-default-unknown) - The current result.

Returns: `BettererDiff<DeserialisedType, DiffType>`

## `BettererDiff`

A object that describes the diff between two results.

```typescript
type BettererDiff<DeserialisedType = unknown, DiffType = null> = {
  expected: DeserialisedType;
  result: DeserialisedType;
  diff: DiffType;
  log: (logger: BettererLogger) => Promise<void>;
};
```

### Properties

#### `expected`: [`DeserialisedType`](#deserialisedtype-default-unknown)

> The expected result.

#### `result`: [`DeserialisedType`](#deserialisedtype-default-unknown)

> The current result.

#### `diff`: [`DiffType`](#difftype-default-null)

> The difference between `expected` and `result`.

### Methods

### `log()`

> A logging hook for the diff. This is called by the reporter whenever a test becomes worse.

Args:

- `logger`: [`BettererLogger`](./logger#bettererlogger) - The reporter logger.

Returns: `Promise<void>`

## `BettererSerialiser`

The functions that serialises and deserialises a test result between the [`DeserialisedType`](#deserialisedtype-default-unknown) and [`SerialisedType`](#serialisedtype-default-deserialisedtype).

```typescript
type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};
```

## `BettererSerialise`

The functions that coverts from a [`DeserialisedType`](#deserialisedtype-default-unknown) to a [`SerialisedType`](#serialisedtype-default-deserialisedtype).

```typescript
type BettererSerialise<DeserialisedType, SerialisedType> = (result: DeserialisedType) => SerialisedType;
```

Args:

- `result`: [`DeserialisedType`](#deserialisedtype-default-unknown) - The deserialised result.

Returns: [`SerialisedType`](#serialisedtype-default-deserialisedtype)

## `BettererDeserialise`

The functions that coverts from a [`SerialisedType`](#serialisedtype-default-deserialisedtype) to a [`DeserialisedType`](#deserialisedtype-default-unknown).

```typescript
type BettererDeserialise<DeserialisedType, SerialisedType> = (serialised: SerialisedType) => DeserialisedType;
```

Args:

- `serialised`: [`SerialisedType`](#serialisedtype-default-deserialisedtype) - The serialised result.

Returns: [`DeserialisedType`](#deserialisedtype-default-unknown)

## `BettererPrinter`

A function that converts a serialised test result to the string that will be saved in the [test results file](./results-file).

```typescript
type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;
```

Args:

- `serialised`: [`SerialisedType`](#serialisedtype-default-deserialisedtype) - The serialised result.

Returns: `Promise<string>` | `string`

## `BettererProgress`

A function that converts a test result to a number value that represents the progress towards the goal.

```typescript
type BettererProgress<DeserialisedType> = (
  baseline: DeserialisedType | null,
  result: DeserialisedType | null
) => MaybeAsync<BettererDelta | null>;
```

Args:

- `baseline`: [`DeserialisedType`](#deserialisedtype-default-unknown) | `null` - The baseline result.
- `result`: [`DeserialisedType`](#deserialisedtype-default-unknown) | `null` - The current result.

Returns: [`Promise<BettererDelta>`](#bettererdelta) | `Promise<null>` | [`BettererDelta`](#bettererdelta) | `null`
