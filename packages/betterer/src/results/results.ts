import assert from 'assert';

import { read, write, BettererVersionControlWorker } from '../fs';
import { BettererRunSummaries } from '../run';
import { BettererRunNames } from '../run/types';
import { BettererSuiteSummary } from '../suite';
import { parse } from './parser';
import { print } from './printer';
import { BettererExpectedResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V2.`;

export class BettererResultsΩ {
  private constructor(
    private _resultsPath: string,
    private _versionControl: BettererVersionControlWorker,
    private _baseline: BettererExpectedResults,
    private _expected: BettererExpectedResults
  ) {}

  public static async create(
    resultsPath: string,
    versionControl: BettererVersionControlWorker
  ): Promise<BettererResultsΩ> {
    const baseline = await parse(resultsPath);
    return new BettererResultsΩ(resultsPath, versionControl, baseline, baseline);
  }

  public getChanged(runSummaries: BettererRunSummaries): BettererRunNames {
    const missingRuns = Object.keys(this._expected).filter(
      (name) => !runSummaries.find((runSummary) => runSummary.name === name)
    );
    const changedRuns = runSummaries
      .filter((runSummary) => !runSummary.isNew && !runSummary.isFailed && !runSummary.isSkipped)
      .filter((runSummary) => runSummary.printed !== this._expected[runSummary.name].value)
      .map((runSummary) => runSummary.name);
    const newRuns = runSummaries.filter((runSummary) => runSummary.isNew).map((runSummary) => runSummary.name);
    const worseRuns = runSummaries.filter((runSummary) => runSummary.isWorse).map((runSummary) => runSummary.name);
    return [...missingRuns, ...changedRuns, ...newRuns, ...worseRuns];
  }

  public getExpected(name: string): [string, string] {
    const baseline = this._getResult(name, this._baseline);
    const expected = this._getResult(name, this._expected) || baseline;
    return [baseline, expected];
  }

  public hasResult(name: string): boolean {
    return Object.hasOwnProperty.call(this._expected, name);
  }

  public async sync(): Promise<void> {
    this._expected = await parse(this._resultsPath);
  }

  public async write(suiteSummary: BettererSuiteSummary, precommit: boolean): Promise<void> {
    const expected = await read(this._resultsPath);
    const result = this._print(suiteSummary.runs);
    const shouldWrite = expected !== result;
    if (shouldWrite) {
      await write(result, this._resultsPath);
      await this._versionControl.writeCache();
      if (precommit) {
        await this._versionControl.add(this._resultsPath);
      }
    }
  }

  private _getResult(name: string, expectedResults: BettererExpectedResults): string {
    const hasResult = Object.hasOwnProperty.call(expectedResults, name);
    assert(hasResult);
    const { value } = expectedResults[name];
    return value;
  }

  private _print(runSummaries: BettererRunSummaries): string {
    const toPrint = runSummaries.filter((runSummary) => runSummary.printed != null);
    const printedResults = toPrint.map((runSummary) => print(runSummary.name, runSummary.printed as string));
    return [RESULTS_HEADER, ...printedResults].join('');
  }
}
