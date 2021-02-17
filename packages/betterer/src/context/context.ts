import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererReporterΩ } from '../reporters';
import { requireUncached } from '../require';
import { BettererResultsΩ } from '../results';
import { BettererFilePaths } from '../runner';
import { defer, Defer } from '../utils';
import {
  BettererTest,
  BettererTestBase,
  BettererTestMap,
  BettererTestConfigMap,
  BettererTestConfigPartial,
  isBettererFileTestΔ,
  isBettererTest
} from '../test';
import { BettererRunΩ } from './run';
import { BettererSummaryΩ } from './summary';
import { BettererContext, BettererRunNames, BettererRuns, BettererSummaries, BettererSummary } from './types';

export type BettererRunner = (runs: BettererRuns) => Promise<void>;

export class BettererContextΩ implements BettererContext {
  private _results: BettererResultsΩ;
  private _summaries: BettererSummaries = [];
  private _tests: BettererTestMap = {};

  private _running: Promise<void> | null = null;
  private _lifecycle: Defer<BettererSummaries>;

  constructor(public readonly config: BettererConfig, private _reporter: BettererReporterΩ) {
    this._results = new BettererResultsΩ(this.config.resultsPath);
    this._lifecycle = defer();
  }

  public get lifecycle(): Promise<BettererSummaries> {
    return this._lifecycle.promise;
  }

  public async start(): Promise<void> {
    await this._reporter.contextStart(this, this.lifecycle);
  }

  public async run(runner: BettererRunner, filePaths: BettererFilePaths = []): Promise<BettererSummary> {
    if (this._running) {
      await this._running;
    }

    this._tests = this._initTests();
    this._initFilters();

    const obsolete = await this._initObsolete();
    const runs = await Promise.all(
      Object.keys(this._tests)
        .filter((name) => {
          const test = this._tests[name];
          // Only run BettererFileTests when a list of filePaths is given:
          return !filePaths.length || isBettererFileTestΔ(test);
        })
        .map(async (name) => {
          const test = this._tests[name];
          const { isSkipped, config } = test;
          const isObsolete = obsolete.includes(name);
          const baseline = await this._results.getBaseline(name, config);
          const expected = await this._results.getExpectedResult(name, config);
          return new BettererRunΩ(this._reporter, name, config, expected, baseline, filePaths, isSkipped, isObsolete);
        })
    );
    await this._reporter.runsStart(runs, filePaths);
    this._running = runner(runs);
    await this._running;
    const result = await this._results.print(runs);
    const expected = await this._results.read();
    const summary = new BettererSummaryΩ(runs, result, expected);
    this._summaries.push(summary);
    await this._reporter.runsEnd(summary, filePaths);
    return summary;
  }

  public async end(write: boolean): Promise<void> {
    assert(this._summaries);
    this._lifecycle.resolve(this._summaries);
    await this._reporter.contextEnd(this, this._summaries);
    if (write) {
      const last = this._summaries[this._summaries.length - 1];
      await this._results.write(last.result);
    }
  }

  public async error(error: BettererError): Promise<void> {
    this._lifecycle.reject(error);
    await this._reporter.contextError(this, error);
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
        const testOrConfig = testOptions[name];
        let test: BettererTestBase | null = null;
        if (!isBettererTest(testOrConfig)) {
          test = new BettererTest(testOptions[name] as BettererTestConfigPartial);
        } else {
          test = testOrConfig;
        }
        tests[name] = test;
      });
      return tests;
    } catch (e) {
      throw new BettererError(`could not read config from "${configPath}". 😔`, e);
    }
  }

  private async _initObsolete(): Promise<BettererRunNames> {
    const expectedNames = await this._results.getExpectedNames();
    return expectedNames.filter((expectedName) => !Object.keys(this._tests).find((name) => name === expectedName));
  }

  private _initFilters(): void {
    // read `filters` here so that it can be updated by watch mode:
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
