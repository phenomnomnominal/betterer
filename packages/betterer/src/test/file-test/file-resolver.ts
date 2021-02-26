import stack from 'callsite';
import globby from 'globby';
import * as path from 'path';

import { BettererFilePaths } from '../../runner';
import { flatten, normalisedPath } from '../../utils';
import { BettererFileGlobs, BettererFilePatterns } from './types';

export class BettererFileResolver {
  private _cwd: string;
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  constructor(resolverDepth = 2) {
    // In DEBUG mode there is a Proxy that wraps each function call.
    // That means that each function call results in two entries in
    // the call stack, so we adjust here:
    resolverDepth = process.env.BETTERER_DEBUG ? resolverDepth * 2 : resolverDepth;

    const callStack = stack();
    const callee = callStack[resolverDepth];
    this._cwd = path.dirname(callee.getFileName());
  }

  public get cwd(): string {
    return this._cwd;
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (this._included.length === 0) {
      return this._filterExcludedFiles(filePaths);
    }
    const validPaths = await this._getValidPaths();
    return filePaths.filter((filePath) => validPaths.includes(filePath));
  }

  public resolve(...pathSegments: Array<string>): string {
    return normalisedPath(path.resolve(this._cwd, ...pathSegments));
  }

  /** @internal Definitely not stable! Please don't use! */
  public includeΔ(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns).map((pattern) => this.resolve(pattern))];
    return this;
  }

  /** @internal Definitely not stable! Please don't use! */
  public excludeΔ(...excludePatterns: BettererFilePatterns): this {
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  public async files(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (!filePaths.length) {
      return this._getValidPaths();
    }
    return this.validate(filePaths);
  }

  private async _getValidPaths(): Promise<BettererFilePaths> {
    const resolved = await this._resolveIncludeGlobs();
    return this._filterExcludedFiles(resolved);
  }

  private _filterExcludedFiles(filePaths: BettererFilePaths): BettererFilePaths {
    return filePaths.filter((filePath) => {
      return !this._excluded.some((exclude: RegExp) => exclude.test(filePath));
    });
  }

  private async _resolveIncludeGlobs(): Promise<BettererFilePaths> {
    const resolvedPaths: Array<string> = [];
    await Promise.all(
      this._included.map(async (currentGlob) => {
        const globFiles = await globby(currentGlob, {
          cwd: this.cwd,
          gitignore: true
        });
        resolvedPaths.push(...globFiles);
      })
    );
    return resolvedPaths;
  }
}
