import assert from 'assert';
import { BettererConfig } from '../config';

import { forceRelativePaths, read, write } from '../fs';
import { BettererRunSummaries } from '../run';
import { parse } from './parser';
import { print } from './printer';
import { BettererExpectedResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V2.`;

export class BettererResultsΩ {
  private _baseline: BettererExpectedResults | null = null;
  private _expected: BettererExpectedResults | null = null;
  private _resultsPath: string;

  constructor(private _config: BettererConfig) {
    this._resultsPath = this._config.resultsPath;
  }

  public async sync(): Promise<void> {
    this._expected = await parse(this._resultsPath);
    if (!this._baseline) {
      this._baseline = this._expected;
    }
  }

  public getExpected(name: string): [string, string] {
    assert(this._baseline);
    assert(this._expected);
    const baseline = this._getResult(name, this._baseline);
    const expected = this._getResult(name, this._expected) || baseline;
    return [baseline, expected];
  }

  public hasResult(name: string): boolean {
    return Object.hasOwnProperty.call(this._expected, name);
  }

  public read(): Promise<string | null> {
    return read(this._resultsPath);
  }

  public print(runs: BettererRunSummaries): string {
    const toPrint = runs.filter((run) => run.printed != null);
    const printedResults = toPrint.map((run) => print(run.name, run.printed as string));
    const printed = [RESULTS_HEADER, ...printedResults].join('');
    return forceRelativePaths(printed, this._resultsPath);
  }

  public write(printed: string): Promise<void> {
    return write(printed, this._resultsPath);
  }

  private _getResult(name: string, expectedResults: BettererExpectedResults): string {
    const hasResult = Object.hasOwnProperty.call(expectedResults, name);
    assert(hasResult);
    const { value } = expectedResults[name];
    return value;
  }
}
