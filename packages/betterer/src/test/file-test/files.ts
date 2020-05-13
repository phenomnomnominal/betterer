import { BettererFile } from './file';

export class BettererFiles {
  private _fileMap: Record<string, BettererFile> = {};

  constructor(public readonly files: ReadonlyArray<BettererFile>) {
    this.files.forEach((file) => {
      this._fileMap[file.absolutePath] = file;
    });
  }

  public getFile(absolutePath: string): BettererFile | void {
    return this._fileMap[absolutePath];
  }
}
