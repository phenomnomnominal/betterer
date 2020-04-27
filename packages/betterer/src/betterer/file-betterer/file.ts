import LinesAndColumns from 'lines-and-columns';

import { hash } from '../../hasher';
import { BettererFileMarksMap, BettererFileInfo, BettererFileMarks } from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0,
} as const;

export class BettererFile {
  private _fileInfo: ReadonlyArray<BettererFileInfo> = [];
  private _fileHash = '';
  private _fileMarks: BettererFileMarks = [];
  private _filePath = '';

  static fromInfo(filePath: string, fileInfo: ReadonlyArray<BettererFileInfo>): BettererFile {
    const file = new BettererFile();
    file._filePath = filePath;
    file._fileInfo = fileInfo;
    file._fileMarks = [...file._getMarks(fileInfo)].sort((a, b) => {
      const [aStart] = a;
      const [bStart] = b;
      return aStart - bStart;
    });
    const [{ fileText }] = fileInfo;
    file._fileHash = hash(fileText);
    return file;
  }

  static deserialise(serialised: BettererFileMarksMap): BettererFile {
    const file = new BettererFile();
    Object.keys(serialised).forEach((key) => {
      const [filePath, fileHash] = key.split(':');
      file._filePath = filePath;
      file._fileHash = fileHash;
      file._fileMarks = serialised[key];
    });
    return file;
  }

  public get fileHash(): string {
    return this._fileHash;
  }

  public get fileInfo(): ReadonlyArray<BettererFileInfo> {
    return this._fileInfo;
  }

  public get fileMarks(): BettererFileMarks {
    return this._fileMarks;
  }

  public get filePath(): string {
    return this._filePath;
  }

  private _getMarks(fileInfo: ReadonlyArray<BettererFileInfo>): BettererFileMarks {
    return fileInfo.map((info) => {
      const { fileText, start, end, message } = info;
      const lc = new LinesAndColumns(fileText);
      const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
      return [line, column, end - start, message];
    });
  }
}
