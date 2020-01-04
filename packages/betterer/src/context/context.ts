import { BettererError } from '@betterer/errors';
import { createBetterer } from '../betterer';
import {
  BettererConfig,
  BettererConfigFilters,
  BettererConfigPaths
} from '../config';
import { CANT_READ_CONFIG } from '../errors';
import { BettererReporters } from '../reporters';
import {
  BettererResults,
  BettererResultsValues,
  print,
  read,
  write
} from './results';
import { BettererRun } from './run';
import { BettererStats } from './statistics';
import { BettererTest } from './test';
import { BettererRuns, BettererTests } from './types';
import { BettererFilePaths } from '../files';

export class BettererContext {
  private _tests: BettererTests = [];
  private _expected: BettererResultsValues = {};
  private _expectedRaw: BettererResults = {};

  public static async create(
    config: BettererConfig,
    reporters: BettererReporters
  ): Promise<BettererContext> {
    const context = new BettererContext(config, reporters);
    await context._init();
    return context;
  }

  public get expected(): BettererResultsValues {
    return this._expected;
  }

  public get tests(): BettererTests {
    return this._tests;
  }

  public getResults(runs: BettererRuns): BettererResults {
    return runs
      .map(run => this._createResults(run.name, run.result))
      .reduce((p, n) => {
        return { ...p, ...n };
      }, {});
  }

  public getRuns(files: BettererFilePaths = []): BettererRuns {
    this._tests.map(test => {
      return new BettererRun(test, files);
    });
    return [];
  }

  private constructor(
    public readonly config: BettererConfig,
    private _reporters: BettererReporters,
    public readonly stats = new BettererStats()
  ) {
    this._reporters.context?.start?.();
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
    return this.stats;
  }

  public runnerStart(): void {
    this._reporters.runner?.start?.();
  }

  public runnerEnd(runs: BettererRuns, files: BettererFilePaths = []): void {
    this._reporters.runner?.end?.(runs, files);
  }

  public runBetter(run: BettererRun): void {
    const { name } = run;
    this.stats.better.push(name);
    this._reporters.run?.better?.(run);
  }

  public runEnd(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      this.stats.completed.push(name);
    }
  }

  public runFailed(run: BettererRun): void {
    const { name } = run;
    this.stats.failed.push(name);
    this._reporters.run?.failed?.(run);
  }

  public runNew(run: BettererRun): void {
    const { name } = run;
    this.stats.new.push(name);
    this._reporters.run?.new?.(run);
  }

  public runRan(run: BettererRun): void {
    this.stats.ran.push(run.name);
  }

  public runSame(run: BettererRun): void {
    const { name } = run;
    this.stats.same.push(name);
    this._reporters.run?.same?.(run);
  }

  public runSkipped(run: BettererRun): void {
    const { name } = run;
    this.stats.skipped.push(name);
  }

  public runStart(run: BettererRun): void {
    this._reporters.run?.start?.(run);
  }

  public runWorse(
    run: BettererRun,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void {
    const { name } = run;
    this.stats.worse.push(name);
    this._reporters.run?.worse?.(run, result, serialised, expected);
  }

  private async _init(): Promise<void> {
    this._expectedRaw = await this._initExpected(this.config.resultsPath);
    this._expected = this._initExpectedValues(this._expectedRaw);

    this._tests = await this._initTests(this.config.configPaths);
    this._initFilters(this.config.filters);
    this._initObsolete();
  }

  private async _initTests(
    configPaths: BettererConfigPaths = []
  ): Promise<BettererTests> {
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

  private async _initExpected(resultsPath: string): Promise<BettererResults> {
    let expected: BettererResults = {};
    if (resultsPath) {
      expected = await read(resultsPath);
    }
    return expected;
  }

  private _initExpectedValues(
    expected: BettererResults
  ): BettererResultsValues {
    const expectedValues: BettererResultsValues = {};
    Object.keys(expected).forEach(name => {
      expectedValues[name] = JSON.parse(expected[name].value as string);
    });
    return expectedValues;
  }

  private _initFilters(filters: BettererConfigFilters = []): void {
    if (filters.length) {
      this.tests.forEach(test => {
        if (!filters.some(filter => filter.test(test.name))) {
          test.betterer.skip();
        }
      });
    }
  }

  private _initObsolete(): void {
    const obsolete = Object.keys(this._expected).filter(
      name => !this.tests.find(test => test.name === name)
    );
    obsolete.forEach(name => {
      delete this._expected[name];
    });
    this.stats.obsolete.push(...obsolete);
  }

  private async _getTests(configPath: string): Promise<BettererTests> {
    try {
      const imported = await import(configPath);
      const betterers = imported.default ? imported.default : imported;
      return Object.keys(betterers).map(name => {
        return new BettererTest(name, this, createBetterer(betterers[name]));
      });
    } catch {
      throw CANT_READ_CONFIG(configPath);
    }
  }

  private _createResults(name: string, value: unknown): BettererResults {
    return {
      [name]: {
        timestamp: Date.now(),
        value
      }
    };
  }
}
