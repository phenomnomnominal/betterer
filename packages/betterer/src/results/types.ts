import type { BettererFileIssues } from '../test/index.js';

/**
 * @public The deserialised result object for a single run of a single {@link @betterer/betterer#BettererTest | `BettererTest`}.
 *
 * @remarks Having a wrapper like this is useful to distinguish between no result (`null`),
 * and a test that had a null result `{ value: null }`.
 */
export interface BettererResult {
  /**
   * The actual value of the result.
   *
   * @remarks could be anything, including `null`!
   */
  value: unknown;
  /**
   * The printed value of the result.
   *
   * @remarks may not exist if the test is _new_, and _failed_ or _skipped_!
   */
  printed: string;
}

/**
 * @knipignore used by an exported function
 *
 * The result object for a single run of a single {@link @betterer/betterer#BettererTest | `BettererTest`}.
 * The `value` is first serialised and then `JSON.stringify()`-ed, so it needs
 * to be `JSON.parse()`-ed and then deserialised to be useful.
 */
export interface BettererResultSerialised {
  value: string;
}

/**
 * The results object for a single run of a suite of {@link @betterer/betterer#BettererTest | `BettererTest`-s}.
 * Each key is the `name` of a test, and the value is the {@link BettererResult | serialised result}.
 */
export type BettererResultsSerialised = Record<string, BettererResultSerialised>;

/**
 * @public A summary of the results of the defined {@link @betterer/betterer#BettererTest | `BettererTest`s}.
 *
 * @remarks The result of calling {@link @betterer/betterer#results | `betterer.results()`}.
 */
export interface BettererResultsSummary {
  /**
   * An array containing a {@link @betterer/betterer#BettererResultSummary | `BettererResultSummary`}
   * for each test in the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   */
  resultSummaries: BettererResultSummaries;
}

/**
 * @public An array of {@link @betterer/betterer#BettererResultSummary | `BettererResultSummary`}.
 */
export type BettererResultSummaries = ReadonlyArray<BettererResultSummary>;

/**
 * @public The summary of the result of a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
 */
export interface BettererFileTestResultSummary {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Specifies that the test is a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
   */
  isFileTest: true;
  /**
   * The result of the test. A mapping from the path to a file to an array of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`}.
   */
  details: BettererFileTestResultSummaryDetails;
}

/**
 * @public The summary of the result of a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export interface BettererTestResultSummary {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Specifies that the test is a {@link @betterer/betterer#BettererTest | `BettererTest`}.
   */
  isFileTest: false;
  /**
   * The printed result of the test.
   */
  details: BettererTestResultSummaryDetails;
}

/**
 * @public The summary of the result of a {@link @betterer/betterer#BettererTest | `BettererTest`}
 * or {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
 */
export type BettererResultSummary = BettererTestResultSummary | BettererFileTestResultSummary;

/**
 * @public The summarised result of a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
 * A mapping from the path to a file to an array of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`}.
 */
export type BettererFileTestResultSummaryDetails = Record<string, BettererFileIssues>;

/**
 * @public The summarised result of a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export type BettererTestResultSummaryDetails = string;
