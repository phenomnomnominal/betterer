import * as assert from 'assert';
import { createHash } from '../../hasher';
import { BettererFileΩ } from './file';
import { BettererFileResolver } from './file-resolver';
import { BettererFiles, BettererFileIssues, BettererFile, BettererFileBase } from './types';

export class BettererFilesΩ implements BettererFiles {
  private _fileMap: Record<string, BettererFileBase | void> = {};

  constructor(private _resolver?: BettererFileResolver) {}

  public get files(): ReadonlyArray<BettererFileBase> {
    return Object.values(this._fileMap).filter(Boolean) as ReadonlyArray<BettererFileBase>;
  }

  public getFile(absolutePath: string): BettererFileBase {
    const file = this._fileMap[absolutePath];
    assert(file);
    return file;
  }

  public addFile(absolutePath: string, fileText: string): BettererFile {
    assert(this._resolver);
    const file = new BettererFileΩ(absolutePath, createHash(fileText), this._resolver, fileText);
    const existingFile = this._fileMap[absolutePath];
    if (existingFile) {
      file.addIssues(existingFile.issues);
    }
    this._fileMap[absolutePath] = file;
    return file;
  }

  public addExpectedIssues(file: BettererFileBase): void {
    this._fileMap[file.absolutePath] = file;
  }

  public getIssues(absolutePath: string): BettererFileIssues {
    return this.getFile(absolutePath).issues;
  }
}
