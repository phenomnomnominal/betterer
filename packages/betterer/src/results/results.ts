import * as assert from 'assert';

import { BettererConfig } from '../config';
import { BettererTest } from '../test';
import { read } from './reader';
import { BettererRunΩ, BettererRunsΩ } from '../context';
import { print, defaultPrinter } from './printer';
import { write } from './writer';
import { BettererResultΩ } from './result';
import { BettererDiff } from './types';
import { defaultDiffer } from './differ';

export class BettererResults {
  constructor(private _config: BettererConfig) {}

  public async getResultNames(): Promise<Array<string>> {
    const results = await read(this._config.resultsPath);
    return Object.keys(results);
  }

  public async getResult(name: string, test: BettererTest): Promise<BettererResultΩ> {
    const results = await read(this._config.resultsPath);
    if (Object.hasOwnProperty.call(results, name)) {
      assert(results[name]);
      const { value } = results[name];
      const parsed = JSON.parse(value) as unknown;
      return new BettererResultΩ(test.serialiser?.deserialise?.(parsed) || parsed);
    }
    return new BettererResultΩ();
  }

  public getDiff(run: BettererRunΩ): BettererDiff {
    const differ = run.test.differ || defaultDiffer;
    return differ(run.expected.value, run.result.value) as BettererDiff;
  }

  public async print(runs: BettererRunsΩ): Promise<Array<string>> {
    const toPrint = runs.filter((run) => {
      const { isComplete, isNew, isSkipped, isFailed } = run;
      return !(isComplete || (isNew && (isSkipped || isFailed)));
    });
    return await Promise.all(
      toPrint.map(async (run) => {
        const { name, test, isFailed, isSkipped, isWorse } = run;
        const toPrint = isFailed || isSkipped || isWorse ? run.expected : run.result;
        const serialised = test.serialiser?.serialise?.(toPrint.value) || toPrint.value;
        const printer = test.printer || defaultPrinter;
        const printedValue = await printer(serialised);
        return print(name, printedValue);
      })
    );
  }

  public async write(printed: Array<string>): Promise<void> {
    await write(printed, this._config.resultsPath);
  }
}
