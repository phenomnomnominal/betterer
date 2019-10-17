import { LoggerCodeInfo } from '@betterer/logger';
import * as path from 'path';
import { getConfig } from '../config';

export type BettererFileCodeInfo = LoggerCodeInfo;

type BettererFileErrorMap = Record<string, Array<BettererFileCodeInfo> | null>;
type BetterFileMark = [number, number, string?];
type BettererFileMarks = Array<BetterFileMark>;
export type BettererFileInfoSerialised = Record<string, BettererFileMarks>;

export class BettererFileInfo {
  private _files: BettererFileErrorMap = {};
  constructor(info: Array<BettererFileCodeInfo>) {
    const config = getConfig();
    info.forEach(i => {
      const relativePath = path.relative(config.resultsPath, i.filePath);
      this._files[relativePath] = this._files[relativePath] || [];
      (this._files[relativePath] as Array<BettererFileCodeInfo>).push(i);
    });
  }

  public getFilePaths(): Array<string> {
    return Object.keys(this._files);
  }

  public getFileInfo(filePath: string): Array<BettererFileCodeInfo> {
    return this._files[filePath] || [];
  }

  public serialise(): BettererFileInfoSerialised {
    const serialised: BettererFileInfoSerialised = {};
    Object.keys(this._files)
      .filter(filePath => !!this._files[filePath])
      .forEach(filePath => {
        const fileInfo = this._files[filePath] as Array<BettererFileCodeInfo>;

        serialised[filePath] = fileInfo
          .map(info => {
            const { start, end, message } = info;
            return [start, end - start, message] as BetterFileMark;
          })
          .sort(([a], [b]) => a - b);
      });
    return serialised;
  }
}
