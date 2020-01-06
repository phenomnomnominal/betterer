import { Printable } from '../../types';
import { Serialisable } from '../types';
import { BettererFile } from './file';
import {
  BettererFileMarksMap,
  BettererFilePaths,
  BettererFileInfoMap,
  BettererFileHashMap,
  BettererFileMarks,
  BettererFileHashes
} from './types';

export class BettererFiles implements Serialisable<BettererFileMarksMap>, Printable {
  static fromInfo(info: BettererFileInfoMap, included: BettererFilePaths): BettererFiles {
    return new BettererFiles(
      included
        .filter(filePath => info[filePath].length)
        .map(filePath => {
          const fileInfo = info[filePath];
          return BettererFile.fromInfo(filePath, fileInfo);
        })
    );
  }

  static deserialise(serialised: BettererFileMarksMap = {}, files: BettererFilePaths = []): BettererFiles {
    const serialisedFilePaths = Object.keys(serialised);
    let filePaths = serialisedFilePaths;
    if (files.length) {
      filePaths = serialisedFilePaths.filter(serialisedFilePath => files.includes(serialisedFilePath));
    }
    return new BettererFiles(
      filePaths.map(key => {
        return BettererFile.deserialise({ [key]: serialised[key] });
      })
    );
  }

  private _fileMarksMap: BettererFileMarksMap = {};
  private _fileHashes: BettererFileHashes = [];
  private _fileHashMap: BettererFileHashMap = {};
  private _filePaths: BettererFilePaths = [];

  private constructor(private readonly _files: ReadonlyArray<BettererFile>) {
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

  public get files(): ReadonlyArray<BettererFile> {
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

  public filter(files: BettererFilePaths): BettererFiles {
    return new BettererFiles(this.files.filter(file => files.includes(file.filePath)));
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
        printed += `      [${line}, ${column}, ${length}, ${JSON.stringify(message)}]`;
      });
      printed += `\n    ]`;
    });
    printed += '\n  }';
    return printed;
  }

  public serialise(): BettererFileMarksMap {
    return this._files.reduce((serialised, file) => {
      const { filePath, fileHash, fileMarks } = file;
      serialised = { ...serialised, [`${filePath}:${fileHash}`]: fileMarks };
      return serialised;
    }, {} as BettererFileMarksMap);
  }
}
