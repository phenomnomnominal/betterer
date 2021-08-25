import { parse, print, write, BettererResults } from '@betterer/results';
import assert from 'assert';

import { BettererVersionControlWorker } from '../fs';
import { BettererRunSummaries } from '../run';
import { BettererRunNames, BettererRunSummary } from '../run/types';
import { BettererSuiteSummary } from '../suite';

export class BettererResultsFileΩ {
  private constructor(
    private _resultsPath: string,
    private _versionControl: BettererVersionControlWorker,
    private _baseline: BettererResults,
    private _expected: BettererResults
  ) {}

  public static async create(
    resultsPath: string,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererResultsFileΩ> {
    const baseline = await parse(resultsPath);
    const expected = baseline;
    return new BettererResultsFileΩ(resultsPath, versionControl, baseline, expected);
  }

  public getChanged(runSummaries: BettererRunSummaries): BettererRunNames {
    const missingRuns = Object.keys(this._expected).filter(
      (name) => !runSummaries.find((runSummary) => runSummary.name === name)
    );
    const changedRuns = runSummaries
      .filter((runSummary) => !runSummary.isNew && !runSummary.isFailed && !runSummary.isSkipped)
      .filter((runSummary) => runSummary.printed !== this._getResult(runSummary.name, this._expected))
      .map((runSummary) => runSummary.name);
    const newRuns = runSummaries.filter((runSummary) => runSummary.isNew).map((runSummary) => runSummary.name);
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
    this._expected = await parse(this._resultsPath);
  }

  public async write(suiteSummary: BettererSuiteSummary, precommit: boolean): Promise<void> {
    const printedExpected = print(this._expected);
    const printedResult = print(
      suiteSummary.runs
        .filter((runSummary: BettererRunSummary) => runSummary.printed != null)
        .reduce((results, runSummary) => {
          results[runSummary.name] = { value: runSummary.printed as string };
          return results;
        }, {} as BettererResults)
    );

    const shouldWrite = printedResult !== printedExpected;
    if (shouldWrite) {
      await write(printedResult, this._resultsPath);
      await this._versionControl.writeCache();
      if (precommit) {
        await this._versionControl.add(this._resultsPath);
      }
    }
  }

  private _getResult(name: string, results: BettererResults): string {
    const hasResult = Object.hasOwnProperty.call(results, name);
    assert(hasResult);
    const { value } = results[name];
    return value;
  }
}
