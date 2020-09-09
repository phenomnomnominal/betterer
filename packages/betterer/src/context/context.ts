import * as assert from 'assert';

import { BettererConfig } from '../config';
import { COULDNT_READ_CONFIG } from '../errors';
import { BettererReporter } from '../reporters';
import { requireUncached } from '../require';
import { BettererDiff, BettererResults, BettererResultΩ } from '../results';
import {
  BettererTest,
  BettererTestMap,
  BettererTestConfigPartial,
  BettererTestConfigMap,
  BettererTestState,
  isBettererFileTest,
  isBettererTest
} from '../test';
import { BettererFilePaths } from '../watcher';
import { BettererRunΩ } from './run';
import { BettererSummaryΩ } from './summary';
import { BettererContext, BettererRun, BettererRunNames, BettererRuns, BettererSummary } from './types';

export type BettererRunner = (runs: BettererRuns) => Promise<void>;

export class BettererContextΩ implements BettererContext {
  private _results: BettererResults;
  private _summary: BettererSummary | null = null;
  private _tests: BettererTestMap = {};

  private _running: Promise<void> | null = null;

  constructor(public readonly config: BettererConfig, private _reporter?: BettererReporter) {
    this._results = new BettererResults(config);
    this._reporter?.contextStart?.(this);
  }

  public async setup(): Promise<void> {
    if (this._running) {
      await this._running;
    }

    this._tests = this._initTests();
    this._initFilters();
  }

  public async start(runner: BettererRunner, filePaths: BettererFilePaths = []): Promise<BettererSummary> {
    const runs = await Promise.all(
      Object.keys(this._tests)
        .filter((name) => {
          const test = this._tests[name];
          // Only run BettererFileTests when a list of filePaths is given:
          return !filePaths.length || isBettererFileTest(test);
        })
        .map(async (name) => {
          const test = this._tests[name];
          const { isSkipped, config } = test;
          const expected = await this._results.getResult(name, config);
          const expectedΩ = expected as BettererResultΩ;
          return new BettererRunΩ(this, name, config, expectedΩ, filePaths, isSkipped);
        })
    );
    const obsolete = await this._initObsolete();
    this._reporter?.runsStart?.(runs, filePaths);
    this._running = runner(runs);
    await this._running;
    this._reporter?.runsEnd?.(runs, filePaths);
    const expected = await this._results.read();
    const result = await this._results.print(runs);
    const hasDiff = !!expected && expected !== result;
    this._summary = new BettererSummaryΩ(runs, obsolete, result, hasDiff && !this.config.allowDiff ? expected : null);
    return this._summary;
  }

  public runStart(run: BettererRun): void {
    this._reporter?.runStart?.(run);
  }

  public runDiff(run: BettererRun): BettererDiff {
    return this._results.getDiff(run);
  }

  public runEnd(run: BettererRun): void {
    this._reporter?.runEnd?.(run);
  }

  public end(): void {
    assert(this._summary);
    this._reporter?.contextEnd?.(this, this._summary);
  }

  public async save(): Promise<void> {
    assert(this._summary);
    await this._results.write(this._summary.result);
  }

  private _initTests(): BettererTestMap {
    let tests: BettererTestMap = {};
    this.config.configPaths.map((configPath) => {
      const more = this._getTests(configPath);
      tests = { ...tests, ...more };
    });
    const only = Object.values(tests).find((test) => test.isOnly);
    if (only) {
      Object.values(tests).forEach((test) => {
        if (!test.isOnly) {
          test.skip();
        }
      });
    }
    return tests;
  }

  private _getTests(configPath: string): BettererTestMap {
    try {
      const testOptions = requireUncached<BettererTestConfigMap>(configPath);
      const tests: BettererTestMap = {};
      Object.keys(testOptions).forEach((name) => {
        const maybeTest = testOptions[name];
        let test: BettererTestState | null = null;
        if (!isBettererTest(maybeTest)) {
          test = new BettererTest(testOptions[name] as BettererTestConfigPartial);
        } else {
          test = maybeTest;
        }
        tests[name] = test;
      });
      return tests;
    } catch (e) {
      throw COULDNT_READ_CONFIG(configPath, e);
    }
  }

  private async _initObsolete(): Promise<BettererRunNames> {
    const resultNames = await this._results.getResultNames();
    return resultNames.filter((expectedName) => !Object.keys(this._tests).find((name) => name === expectedName));
  }

  private _initFilters(): void {
    const { filters } = this.config;
    if (filters.length) {
      Object.keys(this._tests).forEach((name) => {
        if (!filters.some((filter) => filter.test(name))) {
          this._tests[name].skip();
        }
      });
    }
  }
}
