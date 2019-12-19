import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';
import { hash } from '../hasher';
import { Printable } from '../printer';
import { Serialisable } from '../serialiser';
import { BettererConfig } from '../types';
import {
  BettererFileMarksMap,
  BettererFileInfo,
  BettererFileInfoMap,
  BettererFileMark,
  BettererFileHashMap
} from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

export class BettererFile
  implements Serialisable<BettererFileMarksMap>, Printable {
  private _fileInfoMap: BettererFileInfoMap | null = null;
  private _fileHashMap: BettererFileHashMap = {};
  private _fileHashes: Array<string> = [];
  private _fileMarkMap: BettererFileMarksMap = {};

  static fromInfo(
    config: BettererConfig,
    info: Array<BettererFileInfo>
  ): BettererFile {
    const file = new BettererFile();
    const fileInfo: BettererFileInfoMap = {};
    info.forEach(i => {
      const relativePath = file._getPath(config.resultsPath, i.filePath);
      fileInfo[relativePath] = fileInfo[relativePath] || [];
      fileInfo[relativePath].push(i);
      file._fileMarkMap[relativePath] = file._fileMarkMap[relativePath] || [];
      file._fileMarkMap[relativePath].push(file._getMarks(i));
    });
    Object.keys(file._fileMarkMap).forEach(filePath => {
      const [{ fileText }] = fileInfo[filePath];
      file._fileHashMap[filePath] = hash(fileText);
      file._fileHashes.push(file._fileHashMap[filePath]);
      file._fileMarkMap[filePath].sort((a, b) => {
        const [aStart] = a;
        const [bStart] = b;
        return aStart - bStart;
      });
    });
    file._fileInfoMap = fileInfo;
    return file;
  }
  static fromSerialised(serialised: BettererFileMarksMap | null): BettererFile {
    const file = new BettererFile();
    if (serialised) {
      Object.keys(serialised).forEach(key => {
        const [path, fileHash] = key.split(':');
        file._fileHashMap[path] = fileHash;
        file._fileHashes.push(fileHash);
        file._fileMarkMap[path] = serialised[key];
      });
    }
    return file;
  }

  public getFilePaths(): Array<string> {
    return Object.keys(this._fileHashMap);
  }

  public getFileInfo(filePath: string): Array<BettererFileInfo> {
    if (!this._fileInfoMap) {
      throw new Error();
    }
    return this._fileInfoMap[filePath] || [];
  }

  public getFileMarks(filePath: string): Array<BettererFileMark> {
    return this._fileMarkMap[filePath] || [];
  }

  public getHash(filePath: string): string {
    return this._fileHashMap[filePath];
  }

  public hasHash(hash: string): boolean {
    return this._fileHashes.includes(hash);
  }

  public serialise(): BettererFileMarksMap {
    const serialised: BettererFileMarksMap = {};
    Object.keys(this._fileMarkMap)
      .filter(filePath => !!this._fileMarkMap[filePath])
      .map(filePath => {
        const marks = this._fileMarkMap[filePath];
        const fileHash = this._fileHashMap[filePath];
        serialised[`${filePath}:${fileHash}`] = marks;
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

  private _getMarks(info: BettererFileInfo): BettererFileMark {
    const { fileText, start, end, message } = info;
    const lc = new LinesAndColumns(fileText);
    const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
    return [line, column, end - start, message] as BettererFileMark;
  }

  private _getPath(resultsPath: string, filePath: string): string {
    const relativeFilePath = path.relative(resultsPath, filePath);
    return path.sep === path.posix.sep
      ? relativeFilePath
      : relativeFilePath.split(path.sep).join(path.posix.sep);
  }
}
