import { BettererFile } from './file';
import { BettererFilePaths } from './types';

export class BettererFiles {
  public readonly filePaths: BettererFilePaths = [];

  private _filesMap: Record<string, BettererFile> = {};
  private _hashMap: Record<string, Array<BettererFile>> = {};

  constructor(public readonly files: ReadonlyArray<BettererFile>) {
    this._filesMap = this.files.reduce((filesMap, file) => {
      filesMap[file.filePath] = file;
      return filesMap;
    }, {} as Record<string, BettererFile>);
    this._hashMap = {};
    this.files.forEach((file) => {
      this._hashMap[file.filePath] = this._hashMap[file.filePath] || [];
      this._hashMap[file.filePath].push(file);
    });
    this.filePaths = this.files.map((file) => file.filePath).sort();
  }

  public hasHash(hash: string): boolean {
    return !!this._hashMap[hash];
  }

  public getFiles(hash: string): ReadonlyArray<BettererFile> {
    return this._hashMap[hash] || [];
  }

  public getFile(filePath: string): BettererFile | void {
    return this._filesMap[filePath];
  }
}
