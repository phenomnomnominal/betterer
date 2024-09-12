import type { BettererResultsFile } from './../fs/index.js';
import type { BettererRunSummaries } from '../run/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererResultsSerialised } from './types.js';

import { invariantΔ } from '@betterer/errors';
import assert from 'node:assert';

import { printResults } from './print.js';

export class BettererResultsΩ {
  private constructor(
    private _resultsFile: BettererResultsFile,
    private _baseline: BettererResultsSerialised
  ) {}

  public get resultsPath(): string {
    return this._resultsFile.resultsPath;
  }

  public static async create(resultsFile: BettererResultsFile) {
    const baseline = await resultsFile.parse();
    if (Object.keys(baseline).length === 1) {
      debugger;
    }
    return new BettererResultsΩ(resultsFile, baseline);
  }

  public async getChanged(runSummaries: BettererRunSummaries): Promise<BettererTestNames> {
    const missingRunNames = Object.keys(await this._getExpected()).filter(
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

  public async getExpected(name: string): Promise<[string, string]> {
    const baseline = this._getResult(name, this._baseline);
    const expected = this._getResult(name, await this._getExpected());
    return [baseline, expected];
  }

  public hasResult(name: string): boolean {
    return Object.hasOwnProperty.call(this._baseline, name);
  }

  public print(): string {
    return printResults(this._baseline);
  }

  public async writeSummary(suiteSummary: BettererSuiteSummary): Promise<string | null> {
    const result = suiteSummary.runSummaries.reduce<BettererResultsSerialised>((results, runSummary) => {
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
    }, {});

    const printedExpected = printResults(await this._getExpected());
    const printedResult = printResults(result);

    const shouldWrite = printedResult !== printedExpected;
    if (shouldWrite) {
      await this._resultsFile.write(printedResult);
      return printedResult;
    }
    return null;
  }

  private _getResult(name: string, results: BettererResultsSerialised): string {
    const result = results[name];
    if (!result) {
      debugger;
    }
    assert(result);
    return result.value;
  }

  private async _getExpected(): Promise<BettererResultsSerialised> {
    return await this._resultsFile.parse();
  }
}
