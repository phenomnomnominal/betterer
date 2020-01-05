import { Serialisable } from '../../types';
import { BettererFile } from './file';
import {
  BettererFileMarksMap,
  BettererFilePaths,
  BettererFileInfoMap,
  BettererFileHashMap,
  BettererFileMarks,
  BettererFileHashes
} from './types';

export class BettererFiles implements Serialisable<BettererFileMarksMap> {
  static fromInfo(info: BettererFileInfoMap, included: BettererFilePaths): BettererFiles {
    return new BettererFiles(
      included.map(filePath => {
        const fileInfo = info[filePath];
        return BettererFile.fromInfo(filePath, fileInfo);
      })
    );
  }

  static fromSerialised(serialised: BettererFileMarksMap): BettererFiles {
    return new BettererFiles(
      Object.keys(serialised).map(key => {
        return BettererFile.fromSerialised({ [key]: serialised[key] });
      })
    );
  }

  private _fileMarksMap: BettererFileMarksMap = {};
  private _fileHashes: BettererFileHashes = [];
  private _fileHashMap: BettererFileHashMap = {};
  private _filePaths: BettererFilePaths = [];

  constructor(private readonly _files: Array<BettererFile>) {
    this._fileHashMap = this._files.reduce((hashMap, file) => {
      hashMap[file.filePath] = file.fileHash;
      return hashMap;
    }, {} as BettererFileHashMap);
    this._fileHashes = Object.keys(this._fileHashMap).map(filePath => this._fileHashMap[filePath]);
    this._fileMarksMap = this._files.reduce((marksMap, file) => {
      marksMap[file.filePath] = file.fileMarks;
      return marksMap;
    }, {} as BettererFileMarksMap);
    this._filePaths = this._files.map(file => file.filePath);
  }

  public get files(): Array<BettererFile> {
    return this._files;
  }

  public hasHash(hash: string): boolean {
    return this._fileHashes.includes(hash);
  }

  public getFileHash(filePath: string): string {
    return this._fileHashMap[filePath];
  }

  public getFileMarks(filePath: string): BettererFileMarks {
    return this._fileMarksMap[filePath];
  }

  public getFilePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public serialise(): BettererFileMarksMap {
    return this._files.reduce((serialised, file) => {
      const { filePath, fileHash, fileMarks } = file;
      serialised = { ...serialised, [`${filePath}:${fileHash}`]: fileMarks };
      return serialised;
    }, {} as BettererFileMarksMap);
  }
}
