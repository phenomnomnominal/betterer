import type { BettererTestMeta } from '../test/index.js';
import type {
  BettererFileGlobs,
  BettererFilePath,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver
} from './types.js';

import { invariantΔ } from '@betterer/errors';
import minimatch from 'minimatch';
import path from 'node:path';

import { getGlobals } from '../globals.js';
import { flatten, normalisedPath } from '../utils.js';
import { getTmpPath } from './temp.js';

export class BettererFileResolverΩ implements BettererFileResolver {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];
  private _includedResolved: Array<string> | null = null;
  private _testName: string | null = null;
  private _validatedFilePaths: Array<string> = [];
  private _validatedFilePathsMap: Record<string, boolean> = {};

  constructor(private _baseDirectory: string | null = null) {}

  public get baseDirectory(): string {
    invariantΔ(this._baseDirectory, '`baseDirectory` is only set once the resolver is initialised!');
    return this._baseDirectory;
  }

  public get initialised(): boolean {
    return !!this._baseDirectory;
  }

  public get testName(): string {
    invariantΔ(this._testName, '`baseDirectory` is only set once the resolver is initialised!');
    return this._testName;
  }

  public init(testMeta: BettererTestMeta): void {
    const { configPath, name } = testMeta;
    this._testName = name;
    this._baseDirectory = path.dirname(configPath);
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    // If `include()` was never called, just filter the given list:
    if (!this._included.length) {
      const { versionControl } = getGlobals();
      const validFilePaths = await versionControl.api.filterIgnored(filePaths);
      return validFilePaths.filter((filePath) => !this._isExcluded(filePath));
    }
    await this._update();
    return filePaths.filter((filePath) => this._validatedFilePathsMap[filePath]);
  }

  public async filterCached(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    const { versionControl } = getGlobals();
    return await versionControl.api.filterCached(this.testName, filePaths);
  }

  public included(filePaths: BettererFilePaths): BettererFilePaths {
    if (!this._included.length) {
      return filePaths;
    }
    return filePaths.filter((filePath) => this._isIncluded(filePath) && !this._isExcluded(filePath));
  }

  public resolve(...pathSegments: Array<string>): string {
    return normalisedPath(path.resolve(this.baseDirectory, ...pathSegments));
  }

  public relative(to: string): string {
    return normalisedPath(path.relative(this.baseDirectory, to));
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

  public async tmp(filePath = ''): Promise<BettererFilePath> {
    const tmpPath = await getTmpPath(filePath);
    return this.relative(tmpPath);
  }

  private async _update(): Promise<void> {
    const { versionControl } = getGlobals();

    this._validatedFilePathsMap = {};
    const filePaths = await versionControl.api.getFilePaths();
    const validatedFilePaths: Array<string> = [];
    filePaths.forEach((filePath) => {
      const includedAndNotExcluded = this._isIncluded(filePath) && !this._isExcluded(filePath);
      this._validatedFilePathsMap[filePath] = includedAndNotExcluded;
      if (includedAndNotExcluded) {
        validatedFilePaths.push(filePath);
      }
    });
    this._validatedFilePaths = validatedFilePaths.sort();
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
