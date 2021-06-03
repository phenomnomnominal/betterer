import stack from 'callsite';
import memoize from 'fast-memoize';
import globby from 'globby';
import minimatch from 'minimatch';
import * as path from 'path';

import { flatten, normalisedPath } from '../utils';
import { BettererFileGlobs, BettererFilePaths, BettererFilePatterns } from './types';

export class BettererFileResolverΩ {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  private _isGitIgnored: ReturnType<typeof globby.gitignore.sync>;
  private _resolvedFilePaths: BettererFilePaths | null = null;

  constructor(private _cwd: string) {
    this._cwd = normalisedPath(this._cwd);
    this._isGitIgnored = memoize(globby.gitignore.sync({ cwd: this._cwd }));
  }

  public get cwd(): string {
    return this._cwd;
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    return Promise.resolve(
      filePaths.filter((filePath) => {
        return this._isIncluded(filePath) && !this._isExcluded(filePath);
      })
    );
  }

  public resolve(...pathSegments: Array<string>): string {
    return normalisedPath(path.resolve(this._cwd, ...pathSegments));
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns).map((pattern) => this.resolve(pattern))];
    return this;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  public async files(filePaths: BettererFilePaths = []): Promise<BettererFilePaths> {
    if (filePaths.length) {
      return this.validate(filePaths);
    }
    return this._getValidFilePaths();
  }

  private async _getValidFilePaths(): Promise<BettererFilePaths> {
    const filePaths = await this._resolveIncludeGlobs();
    return filePaths.filter((filePath) => !this._isExcluded(filePath));
  }

  private _isIncluded(filePath: string): boolean {
    return !this._included.length || this._included.some((pattern) => minimatch(filePath, pattern));
  }

  private _isExcluded(filePath: string): boolean {
    return this._excluded.some((exclude: RegExp) => exclude.test(filePath)) || this._isGitIgnored(filePath);
  }

  private async _resolveIncludeGlobs(): Promise<BettererFilePaths> {
    if (this._resolvedFilePaths) {
      return this._resolvedFilePaths;
    }
    const resolvedFilePaths: Array<string> = [];
    await Promise.all(
      this._included.map(async (currentGlob) => {
        const globFiles = await globby(currentGlob, {
          cwd: this.cwd,
          gitignore: true
        });
        resolvedFilePaths.push(...globFiles);
      })
    );
    this._resolvedFilePaths = resolvedFilePaths;
    return this._resolvedFilePaths;
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

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    return this._resolver.validate(filePaths);
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

  public async files(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    return this._resolver.files(filePaths);
  }
}
