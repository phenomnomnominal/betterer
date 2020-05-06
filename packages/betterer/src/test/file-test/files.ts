import { BettererFile } from './file';
import {
  BettererFileIssues,
  BettererFileIssueMap,
  BettererFilePaths,
  BettererFileHashMap,
  BettererFileHashes
} from './types';

export class BettererFiles<BettererFileIssueType> {
  private _fileIssuesMap: BettererFileIssueMap<BettererFileIssueType> = {};
  private _fileHashes: BettererFileHashes = [];
  private _fileHashMap: BettererFileHashMap = {};

  public readonly filePaths: BettererFilePaths = [];

  constructor(public readonly files: ReadonlyArray<BettererFile<BettererFileIssueType>>) {
    this._fileHashMap = this.files.reduce((hashMap, file) => {
      hashMap[file.filePath] = file.fileHash;
      return hashMap;
    }, {} as BettererFileHashMap);
    this._fileHashes = Object.keys(this._fileHashMap).map((filePath) => this._fileHashMap[filePath]);
    this._fileIssuesMap = this.files.reduce((issuesMap, file) => {
      issuesMap[file.filePath] = file.fileIssues;
      return issuesMap;
    }, {} as BettererFileIssueMap<BettererFileIssueType>);
    this.filePaths = this.files.map((file) => file.filePath);
  }

  public hasHash(hash: string): boolean {
    return this._fileHashes.includes(hash);
  }

  public getFileHash(filePath: string): string {
    return this._fileHashMap[filePath];
  }

  public getFileIssues(filePath: string): BettererFileIssues<BettererFileIssueType> {
    return this._fileIssuesMap[filePath];
  }

  public filter(files: BettererFilePaths): BettererFiles<BettererFileIssueType> {
    return new BettererFiles(this.files.filter((file) => files.includes(file.filePath)));
  }
}
