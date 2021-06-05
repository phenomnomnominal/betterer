import stack from 'callsite';
import memoize from 'fast-memoize';
import globby from 'globby';
import * as path from 'path';

import { flatten, normalisedPath } from '../utils';
import { BettererFileGlobs, BettererFilePaths, BettererFilePatterns } from './types';

type BettererFileTask = () => void | Promise<void>;
type BettererFileTasks = Array<BettererFileTask>;

type Gitignore = ReturnType<typeof globby.gitignore.sync>;

const getGitIgnore = memoize(function getGitignore(cwd: string): Gitignore {
  return memoize(globby.gitignore.sync({ cwd }));
});

export class BettererFileResolverΩ {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  private _isGitIgnored: Gitignore;
  private _tasks: BettererFileTasks = [];
  private _runningTasks: Promise<void> | null = null;

  private _validatedFilePaths: Array<string> = [];
  private _validatedFilePathsMap: Record<string, boolean> = {};

  constructor(private _cwd: string) {
    this._cwd = normalisedPath(this._cwd);
    this._isGitIgnored = getGitIgnore(this._cwd);
  }

  public get cwd(): string {
    return this._cwd;
  }

  public async validate(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    // If `include()` was never called, just filter the given list:
    if (!this._included.length) {
      return filePaths.filter((filePaths) => !this._isExcluded(filePaths));
    }
    await this._wait();
    return Promise.resolve(filePaths.filter((filePath) => this._validatedFilePathsMap[filePath]));
  }

  public resolve(...pathSegments: Array<string>): string {
    return normalisedPath(path.resolve(this._cwd, ...pathSegments));
  }

  public include(...includePatterns: BettererFileGlobs): this {
    const patterns = flatten(includePatterns).map((pattern) => this.resolve(pattern));
    this._included = [...this._included, ...patterns];
    // Use the task queue so that any running `exclude()` happens first
    this._addTask(async () => {
      await Promise.all(
        this._included.map(async (pattern) => {
          const filePaths = await globby(pattern, { cwd: this.cwd });
          filePaths.forEach((filePath) => {
            this._validatedFilePaths.push(filePath);
            this._validatedFilePathsMap[filePath] = true;
          });
        })
      );
      this._update();
    });
    return this;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    const patterns = flatten(excludePatterns);
    this._excluded = [...this._excluded, ...patterns];
    // Use the task queue so that any running `include()` happens first
    this._addTask(() => this._update());
    return this;
  }

  public async files(): Promise<BettererFilePaths> {
    await this._wait();
    return this._validatedFilePaths;
  }

  private _update(): void {
    this._validatedFilePaths = this._validatedFilePaths.filter((filePath) => {
      const included = !this._isExcluded(filePath);
      this._validatedFilePathsMap[filePath] = included;
      return included;
    });
  }

  private _isExcluded(filePath: string): boolean {
    return this._isGitIgnored(filePath) || this._excluded.some((exclude: RegExp) => exclude.test(filePath));
  }

  private async _wait(): Promise<void> {
    this._runningTasks = this._runningTasks || this._runTasks();
    await this._runningTasks;
    this._runningTasks = null;
  }

  private _addTask(task: BettererFileTask): void {
    this._tasks.push(task);
    void this._wait();
  }

  private async _runTasks() {
    while (this._tasks.length > 0) {
      const task = this._tasks.shift();
      if (task) {
        await task();
      }
    }
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
    if (filePaths.length) {
      return this.validate(filePaths);
    }
    return this._resolver.files();
  }
}
