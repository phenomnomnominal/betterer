import assert from 'assert';

import { BettererRuns } from '../context';
import { read } from '../reader';
import { BettererTestConfig } from '../test';
import { write } from '../writer';
import { parse } from './parser';
import { print } from './printer';
import { BettererResultΩ } from './result';
import { BettererExpectedResults, BettererResult } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V2.`;

export class BettererResultsΩ {
  private _baseline: BettererExpectedResults | null = null;

  constructor(private _resultsPath: string) {}

  public async getBaseline(name: string, test: BettererTestConfig): Promise<BettererResult> {
    if (!this._baseline) {
      this._baseline = await parse(this._resultsPath);
    }
    return this._getResult(name, test, this._baseline);
  }

  public async getExpectedNames(): Promise<Array<string>> {
    const results = await parse(this._resultsPath);
    return Object.keys(results);
  }

  public async getExpectedResult(name: string, test: BettererTestConfig): Promise<BettererResult> {
    const expectedResults = await parse(this._resultsPath);
    return this._getResult(name, test, expectedResults);
  }

  public read(): Promise<string | null> {
    return read(this._resultsPath);
  }

  public async print(runs: BettererRuns): Promise<string> {
    const toPrint = runs.filter((run) => {
      const { isComplete, isNew, isSkipped, isFailed } = run;
      return !(isComplete || (isNew && (isSkipped || isFailed)));
    });
    const printedResults = await Promise.all(
      toPrint.map(async (run) => {
        const { name, test, isFailed, isSkipped, isWorse } = run;
        const toPrint = isFailed || isSkipped || isWorse ? run.expected : run.result;
        const serialised = test.serialiser.serialise(toPrint.value);
        const printedValue = await test.printer(serialised);
        return print(name, printedValue);
      })
    );
    return [RESULTS_HEADER, ...printedResults].join('');
  }

  public write(printed: string): Promise<void> {
    return write(printed, this._resultsPath);
  }

  private _getResult(name: string, test: BettererTestConfig, expectedResults: BettererExpectedResults): BettererResult {
    if (Object.hasOwnProperty.call(expectedResults, name)) {
      assert(expectedResults[name]);
      const { value } = expectedResults[name];
      const parsed = JSON.parse(value) as unknown;
      return new BettererResultΩ(test.serialiser.deserialise(parsed));
    }
    return new BettererResultΩ();
  }
}
