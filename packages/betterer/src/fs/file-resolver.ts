import type {
  BettererFileGlobs,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver,
  BettererVersionControlWorker
} from './types.js';

import assert from 'node:assert';
import minimatch from 'minimatch';
import path from 'node:path';

import { flatten, normalisedPath } from '../utils.js';

export class BettererFileResolverΩ implements BettererFileResolver {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];
  private _includedResolved: Array<string> | null = null;
  private _validatedFilePaths: Array<string> = [];
  private _validatedFilePathsMap: Record<string, boolean> = {};

  constructor(
    private _baseDirectory: string | null = null,
    private _versionControl: BettererVersionControlWorker | null = null
  ) {}

  public get baseDirectory(): string {
    assert(this._baseDirectory);
    return this._baseDirectory;
  }

  public get versionControl(): BettererVersionControlWorker {
    assert(this._versionControl);
    return this._versionControl;
  }

  public init(directory: string, versionControl: BettererVersionControlWorker | null): void {
    this._baseDirectory = directory;
    this._versionControl = versionControl;
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    // If `include()` was never called, just filter the given list:
    if (!this._included.length) {
      const validFilePaths = await this.versionControl.api.filterIgnored(filePaths);
      return validFilePaths.filter((filePath) => !this._isExcluded(filePath));
    }
    await this._update();
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
    if (!this._included.length) {
      this.include('**/*');
    }
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  public async files(): Promise<BettererFilePaths> {
    await this._update();
    return this._validatedFilePaths;
  }

  private async _update(): Promise<void> {
    this._validatedFilePathsMap = {};
    const filePaths = await this.versionControl.api.getFilePaths();
    filePaths.forEach((filePath) => {
      this._validatedFilePathsMap[filePath] = this._isIncluded(filePath);
    });
    this._validatedFilePaths = Object.entries(this._validatedFilePathsMap)
      .filter(([filePath, included]) => {
        const includedAndNotExcluded = included && !this._isExcluded(filePath);
        this._validatedFilePathsMap[filePath] = includedAndNotExcluded;
        return includedAndNotExcluded;
      })
      .map(([filePath]) => filePath)
      .sort();
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
