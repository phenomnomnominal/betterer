import stack from 'callsite';
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

export class BettererFileResolverΩ {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];
  private _versionControl: BettererVersionControl;

  private _validatedFilePaths: Array<string> = [];
  private _validatedFilePathsMap: Record<string, boolean> = {};

  constructor(private _cwd: string) {
    this._cwd = normalisedPath(this._cwd);
    this._versionControl = getVersionControl();
  }

  public get cwd(): string {
    return this._cwd;
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
    return normalisedPath(path.resolve(this._cwd, ...pathSegments));
  }

  public include(...includePatterns: BettererFileGlobs): this {
    const patterns = flatten(includePatterns).map((pattern) => this.resolve(pattern));
    this._included = [...this._included, ...patterns];
    return this;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    const patterns = flatten(excludePatterns);
    this._excluded = [...this._excluded, ...patterns];
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
    return this._included.some((pattern) => minimatch(filePath, pattern));
  }

  private _isExcluded(filePath: string): boolean {
    return this._excluded.some((exclude: RegExp) => exclude.test(filePath));
  }
}

export class BettererFileResolver {
  private _resolver: BettererFileResolverΩ;

  constructor(resolverDepth = 2) {
    // In DEBUG mode there is a Proxy that wraps each function call.
    // That means that each function call results in two entries in
    // the call stack, so we adjust here:
    resolverDepth = process.env.BETTERER_DEBUG ? resolverDepth * 2 : resolverDepth;

    const callStack = stack();
    const callee = callStack[resolverDepth];
    const cwd = path.dirname(callee.getFileName());

    this._resolver = new BettererFileResolverΩ(cwd);
  }

  public get cwd(): string {
    return this._resolver.cwd;
  }

  public validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    return Promise.resolve(this._resolver.validate(filePaths));
  }

  public resolve(...pathSegments: Array<string>): string {
    return this._resolver.resolve(...pathSegments);
  }

  /** @internal Definitely not stable! Please don't use! */
  public includeΔ(...includePatterns: BettererFileGlobs): this {
    this._resolver.include(...includePatterns);
    return this;
  }

  /** @internal Definitely not stable! Please don't use! */
  public excludeΔ(...excludePatterns: BettererFilePatterns): this {
    this._resolver.exclude(...excludePatterns);
    return this;
  }

  public files(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (filePaths.length) {
      return this.validate(filePaths);
    }
    return Promise.resolve(this._resolver.files());
  }
}
