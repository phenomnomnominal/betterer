import type { BettererOptionsMerge, BettererResultsFile } from './types.js';
import type { BettererResultsSerialised } from '../results/index.js';

import { createMergeConfig } from './config.js';
import { write } from './index.js';
import { merge } from './merge.js';
import { BettererResultsFileΩ } from './results-file.js';

export class BettererMergerΩ {
  private constructor(
    private _contents: Array<string>,
    private _resultsFile: BettererResultsFile
  ) {}

  public static async create(options: BettererOptionsMerge): Promise<BettererMergerΩ> {
    const { contents, resultsPath } = await createMergeConfig(options);
    return new BettererMergerΩ(contents, new BettererResultsFileΩ(resultsPath));
  }

  public async merge(): Promise<BettererResultsSerialised> {
    const [ours, theirs] = this._contents;
    if (ours != null && theirs != null) {
      return merge(this._resultsFile.resultsPath, ours, theirs) as BettererResultsSerialised;
    } else {
      return await this._resultsFile.parse();
    }
  }

  public async write(printedResults: string): Promise<void> {
    await write(printedResults, this._resultsFile.resultsPath);
  }
}
