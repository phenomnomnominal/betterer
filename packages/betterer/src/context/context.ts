import { BettererError } from '@betterer/errors';
import * as assert from 'assert';

import {
  BettererConfig,
  BettererConfigPartial,
  BettererConfigFilters,
  BettererConfigPaths,
  createConfig
} from '../config';
import { COULDNT_READ_CONFIG } from '../errors';
import { BettererReporters } from '../reporters';
import { print, read, write, NO_PREVIOUS_RESULT, BettererExpectedResults, BettererExpectedResult } from '../results';
import { BettererTest, BettererTests, isBettererTest } from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererRun } from './run';
import { BettererStats } from './statistics';
import { BettererRuns } from './types';

enum BettererContextStatus {
  notReady,
  ready,
  running,
  end
}

export class BettererContext {
  public config: BettererConfig;

  private _stats: BettererStats | null = null;
  private _tests: BettererTests = [];
  private _status = BettererContextStatus.notReady;

  private _running: Promise<void> | null = null;
  private _finish: Function | null = null;

  constructor(config: BettererConfigPartial, private _reporters?: BettererReporters) {
    this.config = createConfig(config);
    this._reporters?.context?.start?.();
  }

  public async setup(): Promise<void> {
    if (this._status === BettererContextStatus.running) {
      await this._running;
    }
    assert(this._status === BettererContextStatus.notReady || this._status === BettererContextStatus.end);
    this._tests = await this._initTests(this.config.configPaths);
    this._initFilters(this.config.filters);
    this._status = BettererContextStatus.ready;
  }

  public tearDown(): void {
    assert.equal(this._status, BettererContextStatus.end);
    assert(this._stats);
    this._reporters?.context?.finish?.(this._stats);
  }

  public async runnerStart(files: BettererFilePaths = []): Promise<BettererRuns> {
    assert.equal(this._status, BettererContextStatus.ready);
    this._stats = new BettererStats();
    this._reporters?.runner?.start?.(files);
    const expectedRaw = await this._initExpected();
    const runs = this._tests.map((test) => {
      const { name } = test;
      let expected: BettererExpectedResult = NO_PREVIOUS_RESULT;
      if (Object.hasOwnProperty.call(expectedRaw, name)) {
        expected = expectedRaw[name];
      }
      return new BettererRun(this, test, expected, files);
    });
    this._status = BettererContextStatus.running;
    this._running = new Promise((resolve) => {
      this._finish = resolve;
    });
    return runs;
  }

  public runnerEnd(runs: BettererRuns, files: BettererFilePaths = []): void {
    assert.equal(this._status, BettererContextStatus.running);
    assert(this._finish);
    this._reporters?.runner?.end?.(runs, files);
    this._status = BettererContextStatus.end;
    this._finish();
  }

  public runStart(run: BettererRun): void {
    this._reporters?.run?.start?.(run);
  }

  public runBetter(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.better.push(name);
    this._reporters?.run?.better?.(run);
  }

  public runFailed(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.failed.push(name);
    this._reporters?.run?.failed?.(run);
  }

  public runNew(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.new.push(name);
    this._reporters?.run?.neww?.(run);
  }

  public runRan(run: BettererRun): void {
    assert(this._stats);
    this._stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.same.push(name);
    this._reporters?.run?.same?.(run);
  }

  public runSkipped(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.skipped.push(name);
  }

  public runWorse(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.worse.push(name);
    this._reporters?.run?.worse?.(run);
  }

  public runEnd(run: BettererRun): void {
    assert(this._stats);
    const { isComplete, name } = run;
    if (isComplete) {
      this._stats.completed.push(name);
    }
  }

  public async process(runs: BettererRuns): Promise<BettererStats> {
    assert.equal(this._status, BettererContextStatus.end);
    assert(this._stats);
    const printed: Array<string> = await Promise.all(runs.filter((run) => run.shouldPrint).map((run) => print(run)));
    let error: BettererError | null = null;
    try {
      await write(printed, this.config.resultsPath);
    } catch (e) {
      error = e;
    }
    if (error) {
      this._reporters?.context?.error?.(error, printed);
    }
    return this._stats;
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

  private async _initTests(configPaths: BettererConfigPaths): Promise<BettererTests> {
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
    assert(this._stats);
    const expectedRaw = await read(this.config.resultsPath);
    const obsolete = Object.keys(expectedRaw).filter((name) => !this._tests.find((test) => test.name === name));
    this._stats.obsolete.push(...obsolete);
    return expectedRaw;
  }

  private _initFilters(filters: BettererConfigFilters): void {
    if (filters.length) {
      this._tests.forEach((test) => {
        if (!filters.some((filter) => filter.test(test.name))) {
          test.skip();
        }
      });
    }
  }
}
