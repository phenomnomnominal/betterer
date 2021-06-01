import { BettererError } from '@betterer/errors';
import { BettererConstraintResult } from '@betterer/constraints';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererReporterΩ } from '../reporters';
import { requireUncached } from '../require';
import { BettererResultsΩ, BettererResultΩ } from '../results';
import { BettererFileManager } from '../runner';
import { defer, Defer } from '../utils';
import {
  BettererTest,
  BettererTestBase,
  BettererTestMap,
  BettererTestConfigMap,
  isBettererFileTestΔ,
  isBettererTest
} from '../test';
import { BettererRunsΩ, BettererRunΩ } from './run';
import { BettererSummaryΩ } from './summary';
import { BettererContext, BettererContextStarted, BettererRunNames, BettererSummaries, BettererSummary } from './types';

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

  public start(): BettererContextStarted {
    const reportContextStart = this._reporter.contextStart(this, this.lifecycle);
    return {
      end: async (write: boolean): Promise<void> => {
        assert(this._summaries);
        this._lifecycle.resolve(this._summaries);
        await reportContextStart;
        await this._reporter.contextEnd(this, this._summaries);
        if (write) {
          const last = this._summaries[this._summaries.length - 1];
          await this._results.write(last.result);
        }
      },
      error: async (error: BettererError): Promise<void> => {
        this._lifecycle.reject(error);
        await reportContextStart;
        await this._reporter.contextError(this, error);
      }
    };
  }

  public async run(fileManager: BettererFileManager): Promise<BettererSummary> {
    if (this._running) {
      await this._running;
    }

    this._tests = this._initTests();
    this._initFilters();

    const obsolete = await this._initObsolete();

    let testNames = Object.keys(this._tests);

    // Only run BettererFileTests when a list of filePaths is given:
    const { filePaths } = fileManager;
    const runFileTests = filePaths.length > 0;
    if (runFileTests) {
      testNames = testNames.filter((name) => isBettererFileTestΔ(this._tests[name]));
    }

    const runs = await Promise.all(
      testNames.map(async (name) => {
        const test = this._tests[name];
        const { isSkipped, config } = test;
        const isObsolete = obsolete.includes(name);
        const baseline = await this._results.getBaseline(name, config);
        const expected = await this._results.getExpectedResult(name, config);
        return new BettererRunΩ(this._reporter, name, config, expected, baseline, fileManager, isSkipped, isObsolete);
      })
    );
    const runsLifecycle = defer<BettererSummary>();
    const reportRunsStart = this._reporter.runsStart(runs, filePaths, runsLifecycle.promise);
    try {
      this._running = this._runTests(runs);
      await this._running;
    } catch (error) {
      runsLifecycle.reject(error);
      await reportRunsStart;
      await this._reporter.runsError(runs, filePaths, error);
      throw error;
    }
    const result = await this._results.print(runs);
    const expected = await this._results.read();
    const summary = new BettererSummaryΩ(runs, result, expected);
    this._summaries.push(summary);
    runsLifecycle.resolve(summary);
    await reportRunsStart;
    await this._reporter.runsEnd(summary, filePaths);

    return summary;
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
      const testConfig = requireUncached<BettererTestConfigMap>(configPath);
      const tests: BettererTestMap = {};
      Object.keys(testConfig).forEach((name) => {
        const testOrConfig = testConfig[name];
        let test: BettererTestBase | null = null;
        if (!isBettererTest(testOrConfig)) {
          test = new BettererTest(testOrConfig);
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

  private async _runTests(runsΩ: BettererRunsΩ): Promise<void> {
    await Promise.all(runsΩ.map((runΩ) => this._runTest(runΩ, this.config.update)));
  }

  private async _runTest(runΩ: BettererRunΩ, update: boolean): Promise<void> {
    const { test } = runΩ;

    const started = runΩ.start();

    if (runΩ.isSkipped) {
      await started.skipped();
      return;
    }

    let result: BettererResultΩ;
    try {
      result = new BettererResultΩ(await test.test(runΩ));
    } catch (e) {
      await started.failed(e);
      return;
    }
    runΩ.ran();

    const goalComplete = await test.goal(result.value);

    if (runΩ.isNew) {
      await started.neww(result, goalComplete);
      return;
    }

    const comparison = await test.constraint(result.value, runΩ.expected.value);

    if (comparison === BettererConstraintResult.same) {
      await started.same(result);
      return;
    }

    if (comparison === BettererConstraintResult.better) {
      await started.better(result, goalComplete);
      return;
    }

    if (update) {
      await started.update(result);
      return;
    }

    await started.worse(result);
    return;
  }
}
