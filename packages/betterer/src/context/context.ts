import * as assert from 'assert';
import * as path from 'path';

import { BettererConfig, BettererConfigFilters, BettererConfigPaths } from '../config';
import { COULDNT_READ_CONFIG } from '../errors';
import { BettererReporter } from '../reporters';
import { requireUncached } from '../require';
import { print, read, write, NO_PREVIOUS_RESULT, BettererExpectedResults, BettererExpectedResult } from '../results';
import {
  BettererTest,
  BettererTests,
  isBettererTest,
  BettererTestMap,
  BettererTestOptions,
  isBettererFileTest
} from '../test';
import { getNormalisedPath } from '../utils';
import { BettererFilePaths } from '../watcher';
import { BettererRunΩ, BettererRunsΩ } from './run';
import { BettererStatsΩ } from './statistics';
import { Resolve, BettererContext } from './types';

enum BettererContextStatus {
  notReady,
  ready,
  running,
  end
}

export class BettererContextΩ implements BettererContext {
  private _stats: BettererStatsΩ | null = null;
  private _tests: BettererTests = [];
  private _status = BettererContextStatus.notReady;

  private _running: Promise<void> | null = null;
  private _finish: Resolve | null = null;

  constructor(public readonly config: BettererConfig, private _reporter?: BettererReporter) {
    this._reporter?.contextStart?.(this);
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
    this._reporter?.contextEnd?.(this, this._stats);
  }

  public async runnerStart(files: BettererFilePaths = []): Promise<BettererRunsΩ> {
    assert.equal(this._status, BettererContextStatus.ready);
    this._stats = new BettererStatsΩ();
    const expectedRaw = await this._initExpected();
    const runs = this._tests
      .filter((test) => {
        // Only run BettererFileTests when a list of files is given:
        return !files.length || isBettererFileTest(test);
      })
      .map((test) => {
        const { name } = test;
        let expected: BettererExpectedResult | null = null;
        if (Object.hasOwnProperty.call(expectedRaw, name)) {
          expected = expectedRaw[name];
        }
        return new BettererRunΩ(this, test, expected || NO_PREVIOUS_RESULT, files);
      });
    this._reporter?.runsStart?.(runs, files);
    this._status = BettererContextStatus.running;
    this._running = new Promise((resolve) => {
      this._finish = resolve as Resolve;
    });
    return runs;
  }

  public runnerEnd(runs: BettererRunsΩ, files: BettererFilePaths = []): void {
    assert.equal(this._status, BettererContextStatus.running);
    assert(this._finish);
    this._reporter?.runsEnd?.(runs, files);
    this._status = BettererContextStatus.end;
    this._finish();
  }

  public runStart(run: BettererRunΩ): void {
    assert(this._stats);
    if (run.isExpired) {
      this._stats.expired.push(run.test.name);
    }
    this._reporter?.runStart?.(run);
  }

  public runBetter(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.better.push(run.test.name);
  }

  public runFailed(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.failed.push(run.test.name);
  }

  public runNew(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.new.push(run.test.name);
  }

  public runRan(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.ran.push(run.test.name);
  }

  public runSame(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.same.push(run.test.name);
  }

  public runSkipped(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.skipped.push(run.test.name);
  }

  public runUpdate(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.updated.push(run.test.name);
  }

  public runWorse(run: BettererRunΩ): void {
    assert(this._stats);
    this._stats.worse.push(run.test.name);
  }

  public runEnd(run: BettererRunΩ): void {
    assert(this._stats);
    if (run.isComplete) {
      this._stats.completed.push(run.test.name);
    }
    this._reporter?.runEnd?.(run);
  }

  public async process(runs: BettererRunsΩ): Promise<BettererStatsΩ> {
    assert.equal(this._status, BettererContextStatus.end);
    assert(this._stats);
    const printed: Array<string> = await Promise.all(runs.filter((run) => run.shouldPrint).map((run) => print(run)));
    try {
      await write(printed, this.config.resultsPath);
    } catch (error) {
      this._reporter?.contextError?.(this, error, printed);
    }
    return this._stats;
  }

  public getAbsolutePathΔ(filePath: string): string {
    return getNormalisedPath(path.resolve(path.dirname(this.config.resultsPath), filePath));
  }

  public getRelativePathΔ(filePath: string): string {
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
