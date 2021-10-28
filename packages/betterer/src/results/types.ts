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

export type BettererResultsSummary = {
  testResultSummaries: BettererTestResultSummaries;
};

export type BettererTestResultSummaries = ReadonlyArray<BettererTestResultSummary>;

export type BettererTestResultSummary =
  | {
      name: string;
      isFileTest: true;
      summary: BettererFileTestResultSummary;
    }
  | {
      name: string;
      isFileTest: false;
      summary: string;
    };

export type BettererFileTestResultSummary = Record<string, BettererFileIssues>;
