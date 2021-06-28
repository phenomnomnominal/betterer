import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererFilePaths, BettererVersionControl } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ, BettererResultΩ } from '../results';
import { BettererGlobals } from '../types';
import { defer, Defer } from '../utils';
import { BettererTestMetaMap, isBettererFileTest } from '../test';
import { BettererRunsΩ, BettererRunΩ } from './run';
import { BettererSummaryΩ } from './summary';
import {
  BettererContext,
  BettererContextStarted,
  BettererRunSummaries,
  BettererRunSummary,
  BettererSummaries,
  BettererSummary
} from './types';
import { loadTests } from '../test/loader';

export class BettererContextΩ implements BettererContext {
  public readonly config: BettererConfig;

  private _lifecycle: Defer<BettererSummaries>;
  private _reporter: BettererReporterΩ;
  private _results: BettererResultsΩ;
  private _running: Promise<BettererRunSummaries> | null = null;
  private _summaries: BettererSummaries = [];
  private _tests: BettererTestMetaMap = {};
  private _versionControl: BettererVersionControl;

  constructor(globals: BettererGlobals) {
    this.config = globals.config;
    this._reporter = globals.reporter;
    this._results = globals.results;
    this._versionControl = globals.versionControl;
    this._lifecycle = defer();
  }

  public get lifecycle(): Promise<BettererSummaries> {
    return this._lifecycle.promise;
  }

  public start(): BettererContextStarted {
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = this._reporter.contextStart(this, this.lifecycle);
    return {
      end: async (): Promise<void> => {
        assert(this._summaries);
        this._lifecycle.resolve(this._summaries);
        await reportContextStart;
        await this._reporter.contextEnd(this, this._summaries);
        const summaryΩ = this._summaries[this._summaries.length - 1] as BettererSummaryΩ;
        if (summaryΩ.shouldWrite) {
          await this._results.write(summaryΩ.result);
          await this._versionControl.writeCache();
          if (this.config.precommit) {
            await this._versionControl.add(this.config.resultsPath);
          }
        }
      },
      error: async (error: BettererError): Promise<void> => {
        this._lifecycle.reject(error);
        await reportContextStart;
        await this._reporter.contextError(this, error);
      }
    };
  }

  public async run(filePaths: BettererFilePaths): Promise<BettererSummary> {
    if (this._running) {
      await this._running;
    }
    await this._results.sync();
    await this._versionControl.sync();

    this._tests = loadTests(this.config);
    const testNames = Object.keys(this._tests);

    // Only run BettererFileTests when a list of filePaths is given:
    const runFileTests = filePaths.length > 0;

    const validFilePaths = filePaths.filter((filePath) => !this._versionControl.isIgnored(filePath));

    const runs = testNames
      .map((name) => {
        const testMeta = this._tests[name];
        const test = testMeta.factory();
        if (runFileTests && !isBettererFileTest(test)) {
          return null;
        }
        const baseline = this._results.getBaseline(name, test);
        const expected = this._results.getExpectedResult(name, test);
        const runFilePaths = isBettererFileTest(test) ? validFilePaths : null;
        return new BettererRunΩ(this.config, name, testMeta, expected, baseline, runFilePaths);
      })
      .filter(Boolean) as BettererRunsΩ;

    const runsLifecycle = defer<BettererSummary>();
    const reportRunsStart = this._reporter.runsStart(runs, validFilePaths, runsLifecycle.promise);
    try {
      this._running = this._runTests(runs);
      const runSummaries = await this._running;
      const result = await this._results.print(runSummaries);
      const expected = await this._results.read();
      const summary = new BettererSummaryΩ(runSummaries, result, expected, this.config.ci);
      this._summaries.push(summary);
      runsLifecycle.resolve(summary);
      await reportRunsStart;
      await this._reporter.runsEnd(summary, validFilePaths);
      return summary;
    } catch (error) {
      runsLifecycle.reject(error);
      await reportRunsStart;
      await this._reporter.runsError(runs, validFilePaths, error);
      throw error;
    }
  }

  public checkCache(filePath: string): boolean {
    return this._versionControl.checkCache(filePath);
  }

  public updateCache(filePaths: BettererFilePaths): void {
    return this._versionControl.updateCache(filePaths);
  }

  private async _runTests(runsΩ: BettererRunsΩ): Promise<BettererRunSummaries> {
    return Promise.all(
      runsΩ.map(async (runΩ) => {
        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = this._reporter.runStart(runΩ, runΩ.lifecycle);
        const runSummary = await this._runTest(runΩ, reportRunStart);
        await reportRunStart;
        await this._reporter.runEnd(runSummary);
        return runSummary;
      })
    );
  }

  private async _runTest(runΩ: BettererRunΩ, reportRunStart: Promise<void>): Promise<BettererRunSummary> {
    const { test } = runΩ;

    const running = runΩ.start();

    if (runΩ.isSkipped) {
      return running.skipped();
    }

    try {
      const result = new BettererResultΩ(await test.test(runΩ, this));
      return running.done(result);
    } catch (error) {
      const runSummary = running.failed(error);
      await reportRunStart;
      await this._reporter.runError(runΩ, error);
      return runSummary;
    }
  }
}
