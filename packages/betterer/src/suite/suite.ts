import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererContextΩ } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ } from '../results';
import { BettererReporterRun, BettererRuns, BettererRunSummaries, BettererRunSummary, BettererRunΩ } from '../run';
import { isBettererFileTest, loadTests } from '../test';
import { Defer, defer } from '../utils';
import { BettererSuiteSummaryΩ } from './suite-summary';
import { BettererSuite, BettererSuiteSummary } from './types';

export class BettererSuiteΩ implements BettererSuite {
  private _config: BettererConfig;
  private _reporter: BettererReporterΩ;
  private _results: BettererResultsΩ;
  private _runs: BettererRuns | null = null;

  constructor(private _context: BettererContextΩ, public filePaths: BettererFilePaths) {
    this._config = this._context.config;
    this._reporter = this._context.reporter;
    this._results = this._context.results;
  }

  public get runs(): BettererRuns {
    assert(this._runs);
    return this._runs;
  }

  public async run(): Promise<BettererSuiteSummary> {
    const tests = loadTests(this._config);
    const testNames = Object.keys(tests);

    // Only run BettererFileTests when a list of filePaths is given:
    const onlyFileTests = this.filePaths.length > 0;

    this._runs = testNames
      .map((name) => {
        const testMeta = tests[name];
        const test = testMeta.factory();
        if (onlyFileTests && !isBettererFileTest(test)) {
          return null;
        }
        const baseline = this._results.getBaseline(name, test);
        const expected = this._results.getExpectedResult(name, test);
        const runFilePaths = isBettererFileTest(test) ? this.filePaths : null;
        return new BettererRunΩ(name, testMeta, expected, baseline, runFilePaths);
      })
      .filter(Boolean) as BettererRuns;

    // Attach lifecycle promises for Reporters:
    const runLifecycles = this._runs.map((run) => {
      const lifecycle = defer<BettererRunSummary>();
      (run as BettererReporterRun).lifecycle = lifecycle.promise;
      return lifecycle;
    });

    const runsLifecycle = defer<BettererSuiteSummary>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportSuiteStart = this._reporter.suiteStart(this, runsLifecycle.promise);
    try {
      const runSummaries = await this._runTests(this.runs, runLifecycles);
      const result = await this._results.print(runSummaries);
      const expected = await this._results.read();
      const suiteSummary = new BettererSuiteSummaryΩ(this, runSummaries, result, expected, this._config.ci);
      runsLifecycle.resolve(suiteSummary);
      await reportSuiteStart;
      await this._reporter.suiteEnd(suiteSummary);
      return suiteSummary;
    } catch (error) {
      runsLifecycle.reject(error);
      await reportSuiteStart;
      await this._reporter.suiteError(this, error);
      throw error;
    }
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
        const runSummary = await runΩ.run(this._context);
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
}
