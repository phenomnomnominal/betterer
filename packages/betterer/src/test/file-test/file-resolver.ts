import * as stack from 'callsite';
import * as globby from 'globby';
import * as path from 'path';

import { flatten, getNormalisedPath } from '../../utils';
import { BettererFilePaths } from '../../watcher';
import { BettererFilePatterns, BettererFileGlobs } from './types';

export class BettererFileResolver {
  private _cwd: string;
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  constructor(depth = 2) {
    const callStack = stack();
    const callee = callStack[depth];
    this._cwd = path.dirname(callee.getFileName());
  }

  public get cwd(): string {
    return this._cwd;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  public async files(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (!filePaths.length) {
      return this._getValidPaths();
    }
    return this.validate(filePaths);
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (this._included.length === 0) {
      return this._filterExcludedFiles(filePaths);
    }
    const validPaths = await this._getValidPaths();
    return filePaths.filter((filePath) => validPaths.includes(filePath));
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns).map((pattern) => this.resolve(pattern))];
    return this;
  }

  public resolve(...pathSegments: Array<string>): string {
    return getNormalisedPath(path.resolve(this._cwd, ...pathSegments));
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
