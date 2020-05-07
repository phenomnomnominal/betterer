import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererConfigFilters, BettererConfigPaths } from '../config';
import { COULDNT_READ_CONFIG } from '../errors';
import { BettererReporters } from '../reporters';
import { print, read, write, NO_PREVIOUS_RESULT, BettererExpectedResults, BettererExpectedResult } from '../results';
import { BettererTest, BettererTests, isBettererTest } from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererRun } from './run';
import { BettererStats } from './statistics';
import { BettererRuns } from './types';

export class BettererContext {
  private _stats: BettererStats | null = null;
  private _tests: BettererTests = [];

  public static async create(config: BettererConfig, reporters?: BettererReporters): Promise<BettererContext> {
    const context = new BettererContext(config, reporters);
    await context._init();
    return context;
  }

  private constructor(public readonly config: BettererConfig, private _reporters?: BettererReporters) {}

  public get stats(): BettererStats {
    if (!this._stats) {
      throw new Error();
    }
    return this._stats;
  }

  public async process(runs: BettererRuns): Promise<BettererStats> {
    const printed: Array<string> = await Promise.all(runs.filter((run) => run.shouldPrint).map((run) => print(run)));
    let error: BettererError | null = null;
    try {
      await write(printed, this.config.resultsPath);
    } catch (e) {
      error = e;
    }
    this._reporters?.context?.finish?.(this);
    if (error) {
      this._reporters?.context?.error?.(error, printed);
    }
    return this.stats;
  }

  public async getRuns(files: BettererFilePaths = []): Promise<BettererRuns> {
    const expectedRaw = await this._initExpected();
    return this._tests.map((test) => {
      const { name } = test;
      let expected: BettererExpectedResult = NO_PREVIOUS_RESULT;
      if (Object.hasOwnProperty.call(expectedRaw, name)) {
        expected = expectedRaw[name];
      }
      return new BettererRun(this, test, expected, files);
    });
  }

  public runnerStart(files: BettererFilePaths = []): void {
    this._stats = new BettererStats();
    this._reporters?.runner?.start?.(files);
  }

  public runnerEnd(runs: BettererRuns, files: BettererFilePaths = []): void {
    this._reporters?.runner?.end?.(runs, files);
  }

  public runBetter(run: BettererRun): void {
    const { name } = run;
    this.stats.better.push(name);
    this._reporters?.run?.better?.(run);
  }

  public runEnd(run: BettererRun): void {
    const { isComplete, name } = run;
    if (isComplete) {
      this.stats.completed.push(name);
    }
  }

  public runFailed(run: BettererRun): void {
    const { name } = run;
    this.stats.failed.push(name);
    this._reporters?.run?.failed?.(run);
  }

  public runNew(run: BettererRun): void {
    const { name } = run;
    this.stats.new.push(name);
    this._reporters?.run?.neww?.(run);
  }

  public runRan(run: BettererRun): void {
    this.stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    const { name } = run;
    this.stats.same.push(name);
    this._reporters?.run?.same?.(run);
  }

  public runSkipped(run: BettererRun): void {
    const { name } = run;
    this.stats.skipped.push(name);
  }

  public runStart(run: BettererRun): void {
    this._reporters?.run?.start?.(run);
  }

  public runWorse(run: BettererRun): void {
    const { name } = run;
    this.stats.worse.push(name);
    this._reporters?.run?.worse?.(run);
  }

  private async _getTests(configPath: string): Promise<BettererTests> {
    try {
      const imported = await import(configPath);
      const tests = imported.default ? imported.default : imported;
      return Object.keys(tests).map((name) => {
        let test = tests[name];
        if (!isBettererTest(test)) {
          test = new BettererTest(tests[name]);
        }
        test.setName(name);
        return test;
      });
    } catch (e) {
      throw COULDNT_READ_CONFIG(configPath, e);
    }
  }

  private async _init(): Promise<void> {
    this._reporters?.context?.start?.();
    this._tests = await this._initTests(this.config.configPaths);
    this._initFilters(this.config.filters);
  }

  private async _initTests(configPaths: BettererConfigPaths = []): Promise<BettererTests> {
    let tests: BettererTests = [];
    await Promise.all(
      configPaths.map(async (configPath) => {
        const more = await this._getTests(configPath);
        tests = [...tests, ...more];
      })
    );
    const only = tests.find((test) => test.isOnly);
    if (only) {
      tests.forEach((test) => {
        if (!test.isOnly) {
          test.skip();
        }
      });
    }
    return tests;
  }

  private async _initExpected(): Promise<BettererExpectedResults> {
    const expectedRaw = await read(this.config.resultsPath);
    const obsolete = Object.keys(expectedRaw).filter((name) => !this._tests.find((test) => test.name === name));
    this.stats.obsolete.push(...obsolete);
    return expectedRaw;
  }

  private _initFilters(filters: BettererConfigFilters = []): void {
    if (filters.length) {
      this._tests.forEach((test) => {
        if (!filters.some((filter) => filter.test(test.name))) {
          test.skip();
        }
      });
    }
  }
}
