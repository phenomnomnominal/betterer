import assert from 'assert';
import minimatch from 'minimatch';
import * as path from 'path';

import {
  getVersionControl,
  BettererFileGlobs,
  BettererFilePaths,
  BettererFilePatterns,
  BettererVersionControl
} from '../fs';
import { flatten, normalisedPath } from '../utils';
import { BettererFileResolver } from './types';

export class BettererFileResolverΩ implements BettererFileResolver {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];
  private _includedResolved: Array<string> | null = null;
  private _versionControl: BettererVersionControl;

  private _validatedFilePaths: Array<string> = [];
  private _validatedFilePathsMap: Record<string, boolean> = {};

  constructor(private _baseDirectory: string | null = null) {
    this._versionControl = getVersionControl();
  }

  public get baseDirectory(): string {
    assert(this._baseDirectory);
    return this._baseDirectory;
  }

  public setBaseDirectory(directory: string): void {
    this._baseDirectory = directory;
  }

  public validate(filePaths: BettererFilePaths): BettererFilePaths {
    // If `include()` was never called, just filter the given list:
    if (!this._included.length) {
      return filePaths.filter((filePath) => {
        return !this._versionControl.isIgnored(filePath) && !this._isExcluded(filePath);
      });
    }
    this._update();
    return filePaths.filter((filePath) => this._validatedFilePathsMap[filePath]);
  }

  public resolve(...pathSegments: Array<string>): string {
    return normalisedPath(path.resolve(this.baseDirectory, ...pathSegments));
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns)];
    return this;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  public files(): BettererFilePaths {
    this._update();
    return this._validatedFilePaths;
  }

  private _update(): void {
    this._validatedFilePathsMap = {};
    this._versionControl.filePaths.forEach((filePath) => {
      this._validatedFilePathsMap[filePath] = this._isIncluded(filePath);
    });
    this._validatedFilePaths = Object.keys(this._validatedFilePathsMap).filter((filePath) => {
      const included = this._validatedFilePathsMap[filePath] && !this._isExcluded(filePath);
      this._validatedFilePathsMap[filePath] = included;
      return included;
    });
  }

  private _isIncluded(filePath: string): boolean {
    if (!this._includedResolved) {
      this._includedResolved = this._included.map((pattern) => this.resolve(pattern));
    }
    return this._includedResolved.some((pattern) => minimatch(filePath, pattern));
  }

  private _isExcluded(filePath: string): boolean {
    return this._excluded.some((exclude: RegExp) => exclude.test(filePath));
  }
}
