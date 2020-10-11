import assert from 'assert';

import { BettererConfig } from '../config';
import { parse } from './parser';
import { BettererRun, BettererRuns } from '../context';
import { defaultPrinter, print } from './printer';
import { read } from '../reader';
import { write } from '../writer';
import { BettererResultΩ } from './result';
import { BettererDiff, BettererResult } from './types';
import { defaultDiffer } from './differ';
import { BettererTestConfig } from '../test/types';

const RESULTS_HEADER = `// BETTERER RESULTS V2.`;

export class BettererResults {
  constructor(private _config: BettererConfig) {}

  public async getResultNames(): Promise<Array<string>> {
    const results = await parse(this._config.resultsPath);
    return Object.keys(results);
  }

  public async getResult(name: string, test: BettererTestConfig): Promise<BettererResult> {
    const results = await parse(this._config.resultsPath);
    if (Object.hasOwnProperty.call(results, name)) {
      assert(results[name]);
      const { value } = results[name];
      const parsed = JSON.parse(value) as unknown;
      return new BettererResultΩ(test.serialiser?.deserialise?.(parsed) || parsed);
    }
    return new BettererResultΩ();
  }

  public getDiff(run: BettererRun): BettererDiff {
    const differ = run.test.differ || defaultDiffer;
    return differ(run.expected.value, run.result.value) as BettererDiff;
  }

  public read(): Promise<string | null> {
    return read(this._config.resultsPath);
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
        const serialised = test.serialiser?.serialise?.(toPrint.value) || toPrint.value;
        const printer = test.printer || defaultPrinter;
        const printedValue = await printer(serialised);
        return print(name, printedValue);
      })
    );
    return [RESULTS_HEADER, ...printedResults].join('');
  }

  public write(printed: string): Promise<void> {
    return write(printed, this._config.resultsPath);
  }
}
