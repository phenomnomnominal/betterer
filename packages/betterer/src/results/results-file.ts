import assert from 'assert';

import { BettererVersionControlWorker, write } from '../fs';
import { BettererRunSummary, BettererRunSummaries } from '../run';
import { BettererSuiteSummary } from '../suite';
import { parseResults } from './parse';
import { printResults } from './print';
import { BettererTestNames } from '../test';
import { BettererResultsSerialised } from './types';

export class BettererResultsFileΩ {
  private constructor(
    private _resultsPath: string,
    private _versionControl: BettererVersionControlWorker,
    private _baseline: BettererResultsSerialised,
    private _expected: BettererResultsSerialised
  ) {}

  public static async create(
    resultsPath: string,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererResultsFileΩ> {
    const baseline = await parseResults(resultsPath);
    const expected = baseline;
    return new BettererResultsFileΩ(resultsPath, versionControl, baseline, expected);
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

  public async sync(): Promise<void> {
    this._expected = await parseResults(this._resultsPath);
  }

  public async writeNew(suiteSummary: BettererSuiteSummary): Promise<void> {
    if (suiteSummary.new.length === 0) {
      return;
    }

    const printedNew = printResults(
      suiteSummary.new
        .filter((runSummary) => !runSummary.isComplete)
        .reduce((results, runSummary: BettererRunSummary) => {
          results[runSummary.name] = { value: runSummary.printed as string };
          return results;
        }, this._expected)
    );

    await write(printedNew, this._resultsPath);
  }

  public async write(suiteSummary: BettererSuiteSummary, precommit: boolean): Promise<void> {
    const printedExpected = printResults(this._expected);
    const printedResult = printResults(
      suiteSummary.runSummaries
        .filter((runSummary: BettererRunSummary) => runSummary.printed != null)
        .reduce((results, runSummary) => {
          results[runSummary.name] = { value: runSummary.printed as string };
          return results;
        }, {} as BettererResultsSerialised)
    );

    const shouldWrite = printedResult !== printedExpected;
    if (shouldWrite) {
      await write(printedResult, this._resultsPath);
      if (precommit) {
        await this._versionControl.add(this._resultsPath);
      }
    }
  }

  private _getResult(name: string, results: BettererResultsSerialised): string {
    const hasResult = Object.hasOwnProperty.call(results, name);
    assert(hasResult);
    const { value } = results[name];
    return value;
  }
}
