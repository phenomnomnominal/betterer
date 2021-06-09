import assert from 'assert';

import { BettererFilePaths, BettererFileResolverΩ } from '../../fs';
import { BettererFileΩ } from './file';
import { BettererFileTestResult, BettererFileIssues, BettererFile, BettererFileBase } from './types';

export class BettererFileTestResultΩ implements BettererFileTestResult {
  private _fileMap: Record<string, BettererFileBase> = {};
  private _files: Array<BettererFileBase> = [];

  constructor(private _resolver?: BettererFileResolverΩ) {}

  // Previously the `files` getter was just doing `Object.values(this._fileMap)`,
  // but that's pretty slow and this gets hit a lot, so instead the `this._files`
  // array is populated manually in `this._addFile()`:
  public get files(): ReadonlyArray<BettererFileBase> {
    return this._files;
  }

  public getFile(absolutePath: string): BettererFileBase {
    const file = this._fileMap[absolutePath];
    assert(file);
    return file;
  }

  public addFile(absolutePath: string, fileText: string): BettererFile {
    assert(this._resolver);
    const file = new BettererFileΩ(absolutePath, fileText);
    const existingFile = this._fileMap[file.absolutePath];
    if (existingFile) {
      file.addIssues(existingFile.issues);
      this._replaceFile(file, existingFile);
      return file;
    }
    this._addFile(file);
    return file;
  }

  public addExpected(file: BettererFileBase): void {
    this._addFile(file);
  }

  public getFilePaths(): BettererFilePaths {
    return Object.keys(this._fileMap);
  }

  public getIssues(absolutePath?: string): BettererFileIssues {
    if (!absolutePath) {
      return this.files.flatMap((files) => files.issues);
    }
    return this.getFile(absolutePath).issues;
  }

  private _addFile(file: BettererFileBase): void {
    if (!this._fileMap[file.absolutePath]) {
      this._files.push(file);
    }
    this._fileMap[file.absolutePath] = file;
  }

  private _replaceFile(file: BettererFileBase, existingFile: BettererFileBase): void {
    this._files.splice(this._files.indexOf(existingFile), 1, file);
    this._fileMap[file.absolutePath] = file;
  }
}
