import LinesAndColumns from 'lines-and-columns';

import { hash } from '../../hasher';
import { BettererFileMarksMap, BettererFileInfo, BettererFileMark, BettererFileMarks } from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export class BettererFile {
  private _fileInfo: Array<BettererFileInfo> = [];
  private _fileHash = '';
  private _fileMarks: BettererFileMarks = [];
  private _filePath = '';

  static fromInfo(filePath: string, fileInfo: Array<BettererFileInfo>): BettererFile {
    const file = new BettererFile();
    file._filePath = filePath;
    file._fileInfo = fileInfo;
    file._fileMarks = file._getMarks(fileInfo);
    const [{ fileText }] = fileInfo;
    file._fileHash = hash(fileText);
    file._fileMarks.sort((a, b) => {
      const [aStart] = a;
      const [bStart] = b;
      return aStart - bStart;
    });
    return file;
  }

  static fromSerialised(serialised: BettererFileMarksMap): BettererFile {
    const file = new BettererFile();
    Object.keys(serialised).forEach(key => {
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

  public get fileInfo(): Array<BettererFileInfo> {
    return this._fileInfo;
  }

  public get fileMarks(): BettererFileMarks {
    return this._fileMarks;
  }

  public get filePath(): string {
    return this._filePath;
  }

  private _getMarks(fileInfo: Array<BettererFileInfo>): BettererFileMarks {
    return fileInfo.map(info => {
      const { fileText, start, end, message } = info;
      const lc = new LinesAndColumns(fileText);
      const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
      const mark: BettererFileMark = [line, column, end - start];
      if (message) {
        mark.push(message);
      }
      return mark;
    });
  }
}
