import type { BettererRunSummaries } from '../run/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererResultsSerialised } from './types.js';

import { invariantΔ } from '@betterer/errors';
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
    const missingRunNames = Object.keys(this._expected).filter(
      (name) => !runSummaries.find((runSummary) => runSummary.name === name)
    );
    const notFailedOrSkipped = runSummaries.filter((runSummary) => !runSummary.isFailed && !runSummary.isSkipped);
    const changedRuns = notFailedOrSkipped
      .filter((runSummary) => !runSummary.isNew)
      .filter((runSummary) => {
        const { result, expected } = runSummary;
        invariantΔ(result, 'Test is not _new_, _failed_, or _skipped_ so it must have a result!');
        invariantΔ(expected, 'Test is not _new_ so it must have an expected result!');
        return result.printed !== expected.printed;
      });
    const newRuns = notFailedOrSkipped.filter((runSummary) => runSummary.isNew && !runSummary.isComplete);
    const newOrChangedRunNames = [...changedRuns, ...newRuns].map((runSummary) => runSummary.name);
    return [...missingRunNames, ...newOrChangedRunNames];
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

  public print(): string {
    return printResults(this._baseline);
  }

  public printSummary(suiteSummary: BettererSuiteSummary): string | null {
    const printedExpected = printResults(this._expected);
    const printedResult = printResults(
      suiteSummary.runSummaries.reduce<BettererResultsSerialised>((results, runSummary) => {
        const { isComplete, isFailed, isSkipped, isNew, isWorse } = runSummary;
        const isSkippedOrFailed = isSkipped || isFailed;
        if (isComplete || (isSkippedOrFailed && isNew)) {
          return results;
        }
        const { expected, name, result } = runSummary;
        if ((isSkippedOrFailed && !isNew) || isWorse) {
          invariantΔ(expected, 'Test is not _new_, or _worse_ so it must have an expected result!');
          results[name] = { value: expected.printed };
          return results;
        }
        invariantΔ(result, 'Test is not _completed_, _skipped_ or _failed_ so it must have a new result!');
        results[name] = { value: result.printed };
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
