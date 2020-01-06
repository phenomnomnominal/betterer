import { BettererError } from '@betterer/errors';
import { BettererFilePaths, createBetterer } from '../betterer';
import { BettererConfig, BettererConfigFilters, BettererConfigPaths } from '../config';
import { CANT_READ_CONFIG } from '../errors';
import { BettererReporters } from '../reporters';
import { BettererResults, print, read, write } from './results';
import { BettererRun } from './run';
import { BettererStats } from './statistics';
import { BettererTest } from './test';
import { BettererRuns, BettererTests } from './types';

export class BettererContext {
  private _expectedRaw: BettererResults = {};
  private _stats: BettererStats = new BettererStats();
  private _tests: BettererTests = [];

  public static async create(config: BettererConfig, reporters: BettererReporters): Promise<BettererContext> {
    const context = new BettererContext(config, reporters);
    await context._init();
    return context;
  }

  private constructor(public readonly config: BettererConfig, private _reporters: BettererReporters) {}

  public get stats(): BettererStats {
    return this._stats;
  }

  public async complete(runs: BettererRuns): Promise<BettererStats> {
    const printed: string = await print(this.getResults(runs));
    let error: BettererError | null = null;
    try {
      await write(printed, this.config.resultsPath);
    } catch (e) {
      error = e;
    }
    this._reporters.context?.complete?.(this);
    if (error) {
      this._reporters.context?.error?.(error, printed);
    }
    return this._stats;
  }

  public getResults(runs: BettererRuns): BettererResults {
    return runs
      .map(run => this._createResults(run.name, run.result))
      .reduce((p, n) => {
        return { ...p, ...n };
      }, {});
  }

  public getRuns(files: BettererFilePaths = []): BettererRuns {
    return this._tests.map(test => {
      return new BettererRun(test, files);
    });
  }

  public runnerStart(): void {
    this._reporters.runner?.start?.();
  }

  public runnerEnd(runs: BettererRuns, files: BettererFilePaths = []): void {
    this._reporters.runner?.end?.(runs, files);
  }

  public runBetter(run: BettererRun): void {
    const { name } = run;
    this._stats.better.push(name);
    this._reporters.run?.better?.(run);
  }

  public runEnd(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      this._stats.completed.push(name);
    }
  }

  public runFailed(run: BettererRun): void {
    const { name } = run;
    this._stats.failed.push(name);
    this._reporters.run?.failed?.(run);
  }

  public runNew(run: BettererRun): void {
    const { name } = run;
    this._stats.new.push(name);
    this._reporters.run?.new?.(run);
  }

  public runRan(run: BettererRun): void {
    this._stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    const { name } = run;
    this._stats.same.push(name);
    this._reporters.run?.same?.(run);
  }

  public runSkipped(run: BettererRun): void {
    const { name } = run;
    this._stats.skipped.push(name);
  }

  public runStart(run: BettererRun): void {
    this._reporters.run?.start?.(run);
  }

  public runWorse(run: BettererRun, result: unknown, expected: unknown): void {
    const { name } = run;
    this._stats.worse.push(name);
    this._reporters.run?.worse?.(run, result, expected);
  }

  private _createResults(name: string, value: unknown): BettererResults {
    return {
      [name]: {
        timestamp: Date.now(),
        value
      }
    };
  }

  private async _getTests(configPath: string): Promise<BettererTests> {
    try {
      const imported = await import(configPath);
      const betterers = imported.default ? imported.default : imported;
      return Object.keys(betterers).map(name => {
        const betterer = createBetterer(betterers[name]);
        return new BettererTest(name, this, betterer, this._expectedRaw);
      });
    } catch {
      throw CANT_READ_CONFIG(configPath);
    }
  }

  private async _init(): Promise<void> {
    this._reporters.context?.start?.();

    this._expectedRaw = await this._initExpectedRaw(this.config.resultsPath);
    this._tests = await this._initTests(this.config.configPaths);
    this._initFilters(this.config.filters);
    this._initObsolete();
  }

  private async _initTests(configPaths: BettererConfigPaths = []): Promise<BettererTests> {
    let tests: BettererTests = [];
    await Promise.all(
      configPaths.map(async configPath => {
        const more = await this._getTests(configPath);
        tests = [...tests, ...more];
      })
    );
    const only = tests.find(test => test.betterer.isOnly);
    if (only) {
      tests.forEach(test => {
        const { betterer } = test;
        if (!betterer.isOnly) {
          betterer.skip();
        }
      });
    }
    return tests;
  }

  private async _initExpectedRaw(resultsPath: string): Promise<BettererResults> {
    let expected: BettererResults = {};
    if (resultsPath) {
      expected = await read(resultsPath);
    }
    return expected;
  }

  private _initFilters(filters: BettererConfigFilters = []): void {
    if (filters.length) {
      this._tests.forEach(test => {
        if (!filters.some(filter => filter.test(test.name))) {
          test.betterer.skip();
        }
      });
    }
  }

  private _initObsolete(): void {
    const obsolete = Object.keys(this._expectedRaw).filter(name => !this._tests.find(test => test.name === name));
    obsolete.forEach(name => {
      delete this._expectedRaw[name];
    });
    this._stats.obsolete.push(...obsolete);
  }
}
