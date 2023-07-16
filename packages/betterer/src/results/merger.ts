import type { BettererOptionsMerge } from '../config';
import type { BettererResultsSerialised } from './types';

import { createMergeConfig } from '../config';
import { write } from '../fs';
import { mergeResults } from './merge';
import { parseResults } from './parse';
import { printResults } from './print';

export class BettererMergerΩ {
  private constructor(private _contents: Array<string>, private _resultsPath: string) {}

  public static async create(options: BettererOptionsMerge): Promise<BettererMergerΩ> {
    const { contents, resultsPath } = await createMergeConfig(options);
    return new BettererMergerΩ(contents, resultsPath);
  }

  public async merge(): Promise<void> {
    let merged: BettererResultsSerialised;
    if (this._contents.length === 2) {
      const [ours, theirs] = this._contents;
      merged = mergeResults(ours, theirs);
    } else {
      merged = await parseResults(this._resultsPath);
    }
    await write(printResults(merged), this._resultsPath);
  }
}
