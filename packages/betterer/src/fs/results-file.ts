import type { BettererResultsSerialised } from '../results/index.js';
import type { BettererFilePath, BettererResultsFile } from './types.js';

import { parse } from './parse.js';
import { write } from './writer.js';

export class BettererResultsFileΩ implements BettererResultsFile {
  constructor(public readonly resultsPath: BettererFilePath) {}

  public async parse(): Promise<BettererResultsSerialised> {
    const parsed = await parse(this.resultsPath);
    return parsed as BettererResultsSerialised;
  }

  public async write(toWrite: string): Promise<void> {
    await write(toWrite, this.resultsPath);
  }
}
