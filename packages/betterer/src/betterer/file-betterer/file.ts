import LinesAndColumns from 'lines-and-columns';

import { createHash } from '../../hasher';
import { BettererFileIssues, BettererFileIssuesMap, BettererFileInfo, } from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0,
} as const;

export class BettererFile {
  private _fileInfo: ReadonlyArray<BettererFileInfo> = [];
  private _fileHash = '';
  private _fileIssues: BettererFileIssues = [];
  private _filePath = '';

  static fromInfo(filePath: string, fileInfo: ReadonlyArray<BettererFileInfo>): BettererFile {
    const file = new BettererFile();
    file._filePath = filePath;
    file._fileInfo = fileInfo;
    file._fileIssues = [...file._getIssues(fileInfo)].sort((a, b) => {
      const [aStart] = a;
      const [bStart] = b;
      return aStart - bStart;
    });
    const [{ fileText }] = fileInfo;
    file._fileHash = createHash(fileText);
    return file;
  }

  static deserialise(serialised: BettererFileIssuesMap): BettererFile {
    const file = new BettererFile();
    Object.keys(serialised).forEach((key) => {
      const [filePath, fileHash] = key.split(':');
      file._filePath = filePath;
      file._fileHash = fileHash;
      file._fileIssues = serialised[key];
    });
    return file;
  }

  public get fileHash(): string {
    return this._fileHash;
  }

  public get fileInfo(): ReadonlyArray<BettererFileInfo> {
    return this._fileInfo;
  }

  public get fileIssues(): BettererFileIssues {
    return this._fileIssues;
  }

  public get filePath(): string {
    return this._filePath;
  }

  private _getIssues(fileInfo: ReadonlyArray<BettererFileInfo>): BettererFileIssues {
    return fileInfo.map((info) => {
      const { fileText, start, end, message, hash } = info;
      const lc = new LinesAndColumns(fileText);
      const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
      const length = end - start;
      const finalHash = hash || createHash(fileText.substr(start, length));
      return [line, column, length, message, finalHash];
    });
  }
}
