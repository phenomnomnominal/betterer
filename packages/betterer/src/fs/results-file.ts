import { parse } from './parse.js';

export class BettererResultsFileΩ {
  constructor(private readonly _resultsPath: string) {}

  public async parse(): Promise<unknown> {
    return await parse(this._resultsPath);
  }
}
