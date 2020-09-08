import { createHash } from '../../hasher';
import { BettererFileΩ } from './file';
import { BettererFile, BettererFileIssues, BettererFiles } from './types';

export class BettererFilesΩ implements BettererFiles {
  private _fileMap: Record<string, BettererFile> = {};

  public get files(): ReadonlyArray<BettererFile> {
    return Object.values(this._fileMap);
  }

  public getFile(absolutePath: string): BettererFile {
    return this._fileMap[absolutePath];
  }

  public addFileHash(absolutePath: string, fileHash: string): BettererFile {
    const file = this.getFile(absolutePath) || new BettererFileΩ(absolutePath, fileHash);
    this._fileMap[absolutePath] = file;
    return file;
  }

  public addFile(absolutePath: string, fileText: string): BettererFile {
    const file = this.getFile(absolutePath) || new BettererFileΩ(absolutePath, createHash(fileText), fileText);
    this._fileMap[absolutePath] = file;
    return file;
  }

  public getIssues(absolutePath: string): BettererFileIssues {
    return this._fileMap[absolutePath].issues;
  }
}
