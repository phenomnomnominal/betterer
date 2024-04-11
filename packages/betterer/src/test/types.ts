import type { BettererConstraintResult } from '@betterer/constraints';
import type { BettererLogs } from '@betterer/logger';
import type { BettererWorkerAPI } from '@betterer/worker';

import type { BettererDelta, BettererRun } from '../run/index.js';
import type { MaybeAsync } from '../types.js';

/**
 * @public A function that checks if a test result is {@link @betterer/constraints#BettererConstraintResult | `better`, `worse`, or the `same`}
 * than the expected result.
 *
 * @example
 * ```typescript
 * import { BettererConstraintResult } from '@betterer/constraints';
 *
 * export function bigger(result: number, expected: number): BettererConstraintResult {
 *   if (result === expected) {
 *     return BettererConstraintResult.same;
 *   }
 *  if (result > expected) {
 *     return BettererConstraintResult.better;
 *   }
 *   return BettererConstraintResult.worse;
 * }
 * ```
 *
 * @param result - Result from the current test run.
 * @param expected - Expected result from the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 */
export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

/**
 * @public The date when the test should be completed by. The test will be marked as `expired` if
 * it runs after the specified date.
 */
export type BettererTestDeadline = Date | string;

/**
 * @public A function that runs the actual test.
 *
 * @example
 * ```typescript
 * import { BettererRun } from '@betterer/betterer';
 *
 * export function test (run: BettererRun): number {
 *   const numberOfJavaScriptFiles = countJavaScriptFiles(run.filePaths);
 *   return numberOfJavaScriptFiles;
 * }
 * ```
 *
 * @param run - The current run.
 */
export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

/**
 * @public A function that returns whether the test has met its goal.
 *
 * @example
 * ```typescript
 * export function goal (result: number): boolean {
 *   return result === 0;
 * }
 * ```
 *
 * @param result - Result from the current test run.
 */
export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

/**
 * @public The result of computing the difference between two results.
 */
export interface BettererDiff<DiffType = null> {
  /**
   * The difference between `expected` and `result`.
   */
  diff: DiffType;
  /**
   * A set of logging instructions that provide insight about the diff. The default reporter will
   * show these to the user once the test is complete.
   */
  logs: BettererLogs;
}

/**
 * @public A function that compares two test results.
 *
 * @param expected - Expected result from the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 * @param result - Result from the current test run.
 */
export type BettererDiffer<DeserialisedType, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => BettererDiff<DiffType>;

/**
 * @public A function that converts a serialised test result into the string that will be saved in
 * the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 *
 * @param serialised - The serialised result.
 */
export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

/**
 * @public A function that converts a test result to a numeric value that represents the progress towards
 * the goal.
 *
 * @param baseline - The baseline result for the test.
 * @param result - The result from the current test run.
 */
export type BettererProgress<DeserialisedType> = (
  baseline: DeserialisedType | null,
  result: DeserialisedType | null
) => MaybeAsync<BettererDelta | null>;

/**
 * @public The function that converts from a `DeserialisedType` to a `SerialisedType`.
 *
 * @param result - The result from the current test run.
 * @param resultsPath - The path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 */
export type BettererSerialise<DeserialisedType, SerialisedType> = (
  result: DeserialisedType,
  resultsPath: string
) => SerialisedType;

/**
 * @public The function that converts from a `SerialisedType` to a `DeserialisedType`.
 *
 * @param serialised - The serialised result.
 * @param resultsPath - The path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 */
export type BettererDeserialise<DeserialisedType, SerialisedType> = (
  serialised: SerialisedType,
  resultsPath: string
) => DeserialisedType;

/**
 * @public The functions that convert between `SerialisedType` and `DeserialisedType`.
 */
export interface BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
}

/**
 * @public The least complex version of a {@link @betterer/betterer#BettererTest | `BettererTest` }
 * operates on simple numbers and can be defined with just a few properties.
 */
export interface BettererTestOptionsBasic {
  /**
   * The constraint function for the test.
   */
  constraint: BettererTestConstraint<number>;
  /**
   * The function that runs the actual test.
   */
  test: BettererTestFunction<number>;
  /**
   * The goal function or goal value for the test.
   */
  goal?: number | BettererTestGoal<number>;
  /**
   * The deadline for the test.
   */
  deadline?: BettererTestDeadline;
}

/**
 * @public For a more complex version of a {@link @betterer/betterer#BettererTest | `BettererTest`} that
 * operates on more complex objects, you need to define more complex behaviour.
 */
export interface BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> {
  /**
   * The constraint function for the test.
   */
  constraint: BettererTestConstraint<DeserialisedType>;
  /**
   * The function that runs the actual test.
   */
  test: BettererTestFunction<DeserialisedType>;
  /**
   * The function that compares two test results.
   */
  differ: BettererDiffer<DeserialisedType, DiffType>;
  /**
   * The function that converts a serialised test result to the string that will be saved in the [test results file](./results-file)
   */
  printer?: BettererPrinter<SerialisedType>;
  /**
   * The function that converts a test result to a numeric value that represents the progress towards the goal.
   */
  progress?: BettererProgress<DeserialisedType>;
  /**
   * The functions that serialises and deserialises a test result between the [`DeserialisedType`](#deserialisedtype-default-unknown) and [`SerialisedType`](#serialisedtype-default-deserialisedtype).
   */
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  /**
   * The goal function or goal value for the test.
   */
  goal: DeserialisedType | BettererTestGoal<DeserialisedType>;
  /**
   * The deadline for the test.
   */
  deadline?: BettererTestDeadline;
}

/**
 * @public Options for creating a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererTestConfig | `BettererTestConfig`}.
 * There is a lot of power (and therefore complexity) in this options object.
 *
 * @typeParam DeserialisedType - The deserialised result type of a test.
 * @typeParam SerialisedType - The serialised type of a test result.
 * @typeParam DiffType - The diff between two results.
 */
export type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> =
  | BettererTestOptionsBasic
  | BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;

/**
 * @public The validated configuration for a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export interface BettererTestConfig<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> {
  configPath: string;
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline: number;
  goal: BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  progress: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * The base interface for a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export interface BettererTestBase<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> {
  config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  isOnly: boolean;
  isSkipped: boolean;
  constraint(constraintOverride: BettererTestConstraint<DeserialisedType>): this;
  goal(goalOverride: BettererTestGoal<DeserialisedType>): this;
  only(): this;
  skip(): this;
}

export type BettererTestFactory = () => MaybeAsync<BettererTestBase>;

export interface BettererTestFactoryMeta {
  readonly configPath: string;
  readonly factory: BettererTestFactory;
  readonly name: string;
}
export type BettererTestFactoryMetaMap = Record<string, BettererTestFactoryMeta>;
export type BettererTestMap = Record<string, BettererTestFactory>;

export type BettererTestMeta = {
  readonly configPath: string;
  readonly name: string;
  readonly isFileTest: boolean;
  readonly isOnly: boolean;
  readonly isSkipped: boolean;
} & (
  | {
      readonly isNew: true;
      readonly baselineJSON: null;
      readonly expectedJSON: null;
    }
  | {
      readonly isNew: false;
      readonly baselineJSON: string;
      readonly expectedJSON: string;
    }
);

/**
 * @public An array of test names.
 */
export type BettererTestNames = ReadonlyArray<string>;

export type BettererTestLoaderWorker = BettererWorkerAPI<typeof import('./loader.worker.js')>;
