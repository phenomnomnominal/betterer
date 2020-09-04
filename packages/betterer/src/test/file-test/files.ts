import { BettererFiles } from './types';
import { BettererFileΩ } from './file';

export class BettererFilesΩ implements BettererFiles {
  private _fileMap: Record<string, BettererFileΩ> = {};

  constructor(public readonly filesΔ: ReadonlyArray<BettererFileΩ>) {
    this.filesΔ.forEach((file) => {
      this._fileMap[file.absolutePath] = file;
    });
  }

  public getFileΔ(absolutePath: string): BettererFileΩ | void {
    return this._fileMap[absolutePath];
  }
}
