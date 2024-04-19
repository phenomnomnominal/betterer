import type { BettererOptionsMerge } from './types.js';

import { createMergeConfig } from './config.js';
import { write } from './index.js';
import { parse } from './parse.js';
import { merge } from './merge.js';

export class BettererMergerΩ {
  private constructor(private _contents: Array<string>, private _filePath: string) {}

  public static async create(options: BettererOptionsMerge): Promise<BettererMergerΩ> {
    const { contents, resultsPath } = await createMergeConfig(options);
    return new BettererMergerΩ(contents, resultsPath);
  }

  public async merge(): Promise<unknown> {
    if (this._contents.length === 2) {
      const [ours, theirs] = this._contents;
      return merge(this._filePath, ours, theirs);
    } else {
      return await parse(this._filePath);
    }
  }

  public async write(printedResults: string): Promise<void> {
    await write(printedResults, this._filePath);
  }
}
