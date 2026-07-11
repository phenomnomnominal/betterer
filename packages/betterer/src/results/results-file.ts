import type { BettererFilePath } from '../fs/index.js';
import type { BettererRun } from '../run/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererResults, BettererResultsSerialised } from './types.js';

import { invariantΔ } from '@betterer/errors';

import { parse, write } from '../fs/index.js';
import { printResults } from './print.js';

// File-based results backend. All results are stored in a single `.betterer.results` file, with one
// line per issue. Simple and compact, but concurrent edits to the same file conflict on merge:
export class BettererResultsFile implements BettererResults {
  private readonly _baseline: BettererResultsSerialised;
  private _expected: BettererResultsSerialised;
  private _printed: string | null = null;
  private _staged: BettererResultsSerialised = {};

  private constructor(
    private readonly _resultsPath: BettererFilePath,
    baseline: BettererResultsSerialised
  ) {
    this._baseline = baseline;
    this._expected = baseline;
  }

  public static async create(resultsPath: BettererFilePath): Promise<BettererResultsFile> {
    const baseline = await parse(resultsPath);
    return new BettererResultsFile(resultsPath, baseline as BettererResultsSerialised);
  }

  public set(run: BettererRun, value: string): void {
    this._staged[run.name] = { value };
  }

  public async write(): Promise<string | null> {
    const results = this._staged;
    this._staged = {};
    const printed = printResults(results);
    this._printed ??= printResults(this._expected);
    if (printed === this._printed) {
      return null;
    }
    await write(printed, this._resultsPath);
    this._expected = results;
    this._printed = printed;
    return this._resultsPath;
  }

  public getBaseline(name: string): string {
    return this._getResult(name, this._baseline);
  }

  public getExpected(name: string): string {
    return this._getResult(name, this._expected);
  }

  public getExpectedTestNames(): BettererTestNames {
    return Object.keys(this._expected);
  }

  public hasBaseline(name: string): boolean {
    return Object.hasOwnProperty.call(this._baseline, name);
  }

  private _getResult(name: string, results: BettererResultsSerialised): string {
    const result = results[name];
    invariantΔ(result, `result for test "${name}" should exist!`);
    return result.value;
  }
}
