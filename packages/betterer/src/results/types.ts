import { BettererFileIssues } from '../test';

/**
 * @public The deserialised result object for a single run of a single {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export type BettererResult = {
  value: unknown;
};

/**
 * The result object for a single run of a single {@link @betterer/betterer#BettererTest | `BettererTest`}.
 * The `value` is first serialised and then `JSON.stringify()`-ed, so it needs
 * to be `JSON.parse()`-ed and then deserialised to be useful.
 */
export type BettererResultSerialised = {
  value: string;
};

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
export type BettererResultsSummary = {
  /**
   * An array containing a {@link @betterer/betterer#BettererTestResultSummary | `BettererTestResultSummary`}
   * for each test in the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   */
  testResultSummaries: BettererTestResultSummaries;
};

/**
 * @public An array of {@link @betterer/betterer#BettererTestResultSummary | `BettererTestResultSummary`}.
 */
export type BettererTestResultSummaries = ReadonlyArray<BettererTestResultSummary>;

/**
 * @package The summary of the result of a {@link @betterer/betterer#BettererTest | `BettererTest`s}.
 */
export type BettererTestResultSummary =
  | {
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
  | {
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
    };

/**
 * @public The result of a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}. A
 * mapping from the path to a file to an array of {@link @betterer/betterer#BettererFileIssues | `BettererFileIssues`}.
 */
export type BettererFileTestResultSummaryDetails = Record<string, BettererFileIssues>;

/**
 * @public The printed result of a {@link @betterer/betterer#BettererTest | `BettererTest`}.
 */
export type BettererTestResultSummaryDetails = string;
