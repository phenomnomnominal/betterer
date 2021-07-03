import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererFilePaths, BettererVersionControl } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ, BettererResultΩ } from '../results';
import { BettererGlobals } from '../types';
import { Defer, defer } from '../utils';
import { BettererTestMetaMap, isBettererFileTest, loadTests } from '../test';
import { BettererRunΩ } from './run';
import { BettererSummaryΩ } from './summary';
import {
  BettererContext,
  BettererContextStarted,
  BettererReporterRun,
  BettererRuns,
  BettererRunSummaries,
  BettererRunSummary,
  BettererSummaries,
  BettererSummary
} from './types';

export class BettererContextΩ implements BettererContext {
  public readonly config: BettererConfig;

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
  }

  public start(): BettererContextStarted {
    const contextLifecycle = defer<BettererSummaries>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = this._reporter.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<void> => {
        contextLifecycle.resolve(this._summaries);
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
        contextLifecycle.reject(error);
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
      .filter(Boolean) as BettererRuns;

    // Attach lifecycle promises for Reporters:
    const runLifecycles = runs.map((run) => {
      const lifecycle = defer<BettererRunSummary>();
      (run as BettererReporterRun).lifecycle = lifecycle.promise;
      return lifecycle;
    });

    const runsLifecycle = defer<BettererSummary>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportRunsStart = this._reporter.runsStart(runs, validFilePaths, runsLifecycle.promise);
    try {
      this._running = this._runTests(runs, runLifecycles);
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

  private async _runTests(
    runs: BettererRuns,
    runLifecycles: Array<Defer<BettererRunSummary>>
  ): Promise<BettererRunSummaries> {
    return Promise.all(
      runs.map(async (run, index) => {
        const lifecycle = runLifecycles[index];
        const runΩ = run as BettererRunΩ;
        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = this._reporter.runStart(runΩ, lifecycle.promise);
        const runSummary = await this._runTest(runΩ);
        if (runSummary.isFailed) {
          const { error } = runSummary;
          lifecycle.reject(error);
          await reportRunStart;
          await this._reporter.runError(runΩ, error);
        } else {
          lifecycle.resolve(runSummary);
          await reportRunStart;
          await this._reporter.runEnd(runSummary);
        }
        return runSummary;
      })
    );
  }

  private async _runTest(runΩ: BettererRunΩ): Promise<BettererRunSummary> {
    const { test } = runΩ;

    const running = runΩ.start();

    if (runΩ.isSkipped) {
      return running.skipped();
    }

    try {
      const result = new BettererResultΩ(await test.test(runΩ, this));
      return running.done(result);
    } catch (error) {
      return running.failed(error);
    }
  }
}
