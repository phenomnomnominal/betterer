import { LoggerCodeInfo } from '@betterer/logger';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';
import { BettererConfig } from '../types';

export type BettererFileCodeInfo = LoggerCodeInfo;

type BettererFileErrorMap = Record<string, Array<BettererFileCodeInfo> | null>;
type BetterFileMark = [number, number, number, string];
type BettererFileMarks = Array<BetterFileMark>;
export type BettererFileInfoSerialised = Record<string, BettererFileMarks>;

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export class BettererFileInfo {
  private _files: BettererFileErrorMap = {};
  constructor(config: BettererConfig, info: Array<BettererFileCodeInfo>) {
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
            const { fileText, start, end, message } = info;
            const lc = new LinesAndColumns(fileText);
            const { line, column } =
              lc.locationForIndex(start) || UNKNOWN_LOCATION;
            return [line, column, end - start, message] as BetterFileMark;
          })
          .sort(([a], [b]) => a - b);
      });
    return serialised;
  }

  public print(): string {
    const toPrint = this.serialise();
    let printed = '{\n';
    Object.keys(toPrint).forEach((filePath, index) => {
      if (index !== 0) {
        printed += ',\n';
      }
      printed += `    "${filePath}": [\n`;
      toPrint[filePath].forEach((mark, index) => {
        if (index !== 0) {
          printed += ',\n';
        }
        const [line, column, length, message] = mark;
        printed += `      [${line}, ${column}, ${length}, ${JSON.stringify(
          message
        )}]`;
      });
      printed += `\n    ]`;
    });
    printed += '\n  }';
    return printed;
  }
}
