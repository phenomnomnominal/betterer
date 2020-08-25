import { BettererFile, BettererFiles } from './types';

export class BettererFilesΩ implements BettererFiles {
  private _fileMap: Record<string, BettererFile> = {};

  constructor(public readonly filesΔ: ReadonlyArray<BettererFile>) {
    this.filesΔ.forEach((file) => {
      this._fileMap[file.absolutePath] = file;
    });
  }

  public getFileΔ(absolutePath: string): BettererFile | void {
    return this._fileMap[absolutePath];
  }
}
