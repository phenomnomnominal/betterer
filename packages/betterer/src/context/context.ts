import { BettererError } from '@betterer/errors';
import * as assert from 'assert';
import * as path from 'path';

import { BettererConfig, BettererConfigFilters, BettererConfigPaths } from '../config';
import { COULDNT_READ_CONFIG } from '../errors';
import { BettererReporter } from '../reporters';
import { print, read, write, NO_PREVIOUS_RESULT, BettererExpectedResults, BettererExpectedResult } from '../results';
import { BettererTest, BettererTests, isBettererTest, BettererTestMap, BettererTestOptions } from '../test';
import { getNormalisedPath } from '../utils';
import { BettererFilePaths } from '../watcher';
import { BettererRun } from './run';
import { BettererStats } from './statistics';
import { BettererRuns } from './types';
import { requireUncached } from '../require';

enum BettererContextStatus {
  notReady,
  ready,
  running,
  end
}

export class BettererContext {
  private _stats: BettererStats | null = null;
  private _tests: BettererTests = [];
  private _status = BettererContextStatus.notReady;

  private _running: Promise<void> | null = null;
  private _finish: Function | null = null;

  constructor(public readonly config: BettererConfig, private _reporter?: BettererReporter) {
    this._reporter?.contextStart?.();
  }

  public async setup(): Promise<void> {
    if (this._status === BettererContextStatus.running) {
      await this._running;
    }
    assert(this._status === BettererContextStatus.notReady || this._status === BettererContextStatus.end);
    this._tests = this._initTests(this.config.configPaths);
    this._initFilters(this.config.filters);
    this._status = BettererContextStatus.ready;
  }

  public tearDown(): void {
    assert.equal(this._status, BettererContextStatus.end);
    assert(this._stats);
    this._reporter?.contextEnd?.(this._stats);
  }

  public async runnerStart(files: BettererFilePaths = []): Promise<BettererRuns> {
    assert.equal(this._status, BettererContextStatus.ready);
    this._stats = new BettererStats();
    this._reporter?.runsStart?.(files);
    const expectedRaw = await this._initExpected();
    const runs = this._tests.map((test) => {
      const { name } = test;
      let expected: BettererExpectedResult | null = null;
      if (Object.hasOwnProperty.call(expectedRaw, name)) {
        expected = expectedRaw[name];
      }
      return new BettererRun(this, test, expected || NO_PREVIOUS_RESULT, files);
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
    this._reporter?.runsEnd?.(runs, files);
    this._status = BettererContextStatus.end;
    this._finish();
  }

  public runStart(run: BettererRun): void {
    assert(this._stats);
    const { isExpired, name } = run;
    if (isExpired) {
      this._stats.expired.push(name);
    }
    this._reporter?.runStart?.(run);
  }

  public runBetter(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.better.push(name);
  }

  public runFailed(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.failed.push(name);
  }

  public runNew(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.new.push(name);
  }

  public runRan(run: BettererRun): void {
    assert(this._stats);
    this._stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    assert(this._stats);
    const { name } = run;
    this._stats.same.push(name);
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
  }

  public runEnd(run: BettererRun): void {
    assert(this._stats);
    const { isComplete, name } = run;
    if (isComplete) {
      this._stats.completed.push(name);
    }
    this._reporter?.runEnd?.(run);
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
      this._reporter?.contextError?.(error, printed);
    }
    return this._stats;
  }

  public getAbsolutePath(filePath: string): string {
    return getNormalisedPath(path.resolve(path.dirname(this.config.resultsPath), filePath));
  }

  public getRelativePath(filePath: string): string {
    return getNormalisedPath(path.relative(path.dirname(this.config.resultsPath), filePath));
  }

  private _initTests(configPaths: BettererConfigPaths): BettererTests {
    let tests: BettererTests = [];
    configPaths.map((configPath) => {
      const more = this._getTests(configPath);
      tests = [...tests, ...more];
    });
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

  private _getTests(configPath: string): BettererTests {
    try {
      const tests = requireUncached<BettererTestMap>(configPath);
      return Object.keys(tests).map((name) => {
        const maybeTest = tests[name];
        let test: BettererTest | null = null;
        if (isBettererTest(maybeTest)) {
          test = maybeTest;
        } else {
          test = new BettererTest(tests[name] as BettererTestOptions<unknown, unknown>);
        }
        assert(test);
        test.setName(name);
        return test;
      });
    } catch (e) {
      throw COULDNT_READ_CONFIG(configPath, e);
    }
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
