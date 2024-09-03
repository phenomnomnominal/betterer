import type { BettererRunSummary, BettererRunSummaries } from '../run/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererResultsSerialised } from './types.js';

import assert from 'node:assert';

import { printResults } from './print.js';

export class BettererResultsΩ {
  private _baseline: BettererResultsSerialised;
  private _expected: BettererResultsSerialised;

  constructor(baseline: unknown) {
    this._baseline = baseline as BettererResultsSerialised;
    this._expected = this._baseline;
  }

  public getChanged(runSummaries: BettererRunSummaries): BettererTestNames {
    const missingRuns = Object.keys(this._expected).filter(
      (name) => !runSummaries.find((runSummary) => runSummary.name === name)
    );
    const changedRuns = runSummaries
      .filter((runSummary) => !runSummary.isNew && !runSummary.isFailed && !runSummary.isSkipped)
      .filter((runSummary) => runSummary.printed !== this._getResult(runSummary.name, this._expected))
      .map((runSummary) => runSummary.name);
    const newRuns = runSummaries
      .filter((runSummary) => runSummary.isNew && !runSummary.isComplete)
      .map((runSummary) => runSummary.name);
    const worseRuns = runSummaries.filter((runSummary) => runSummary.isWorse).map((runSummary) => runSummary.name);
    return [...missingRuns, ...changedRuns, ...newRuns, ...worseRuns];
  }

  public getExpected(name: string): [string, string] {
    const baseline = this._getResult(name, this._baseline);
    const expected = this._getResult(name, this._expected);
    return [baseline, expected];
  }

  public hasResult(name: string): boolean {
    return Object.hasOwnProperty.call(this._expected, name);
  }

  public sync(expected: unknown): void {
    this._expected = expected as BettererResultsSerialised;
  }

  public printNew(suiteSummary: BettererSuiteSummary): string | null {
    if (suiteSummary.new.length === 0) {
      return null;
    }

    return printResults(
      suiteSummary.new
        .filter((runSummary) => !runSummary.isComplete)
        .reduce((results, runSummary: BettererRunSummary) => {
          results[runSummary.name] = { value: runSummary.printed! };
          return results;
        }, this._expected)
    );
  }

  public print(): string {
    return printResults(this._baseline);
  }

  public printSummary(suiteSummary: BettererSuiteSummary): string | null {
    const printedExpected = printResults(this._expected);
    const printedResult = printResults(
      suiteSummary.runSummaries
        .filter((runSummary: BettererRunSummary) => runSummary.printed != null)
        .reduce<BettererResultsSerialised>((results, runSummary) => {
          results[runSummary.name] = { value: runSummary.printed! };
          return results;
        }, {})
    );

    const shouldWrite = printedResult !== printedExpected;
    if (shouldWrite) {
      return printedResult;
    }
    return null;
  }

  private _getResult(name: string, results: BettererResultsSerialised): string {
    const result = results[name];
    assert(result);
    return result.value;
  }
}
