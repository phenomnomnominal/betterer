import { BettererError } from '@betterer/errors';
import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererContextΩ } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererReporterΩ } from '../reporters';
import { BettererResultsΩ } from '../results';
import { BettererReporterRun, BettererRuns, BettererRunSummaries, BettererRunSummary, BettererRunsΩ } from '../run';
import { Defer, defer } from '../utils';
import { BettererSuiteSummaryΩ } from './suite-summary';
import { BettererSuite } from './types';

export class BettererSuiteΩ implements BettererSuite {
  private _config: BettererConfig;
  private _reporter: BettererReporterΩ;
  private _results: BettererResultsΩ;

  constructor(private _context: BettererContextΩ, public filePaths: BettererFilePaths, public runs: BettererRuns) {
    this._config = this._context.config;
    this._reporter = this._context.reporter;
    this._results = this._context.results;
  }

  public async run(): Promise<BettererSuiteSummaryΩ> {
    // Attach lifecycle promises for Reporters:
    const runLifecycles = this.runs.map((run) => {
      const lifecycle = defer<BettererRunSummary>();
      (run as BettererReporterRun).lifecycle = lifecycle.promise;
      return lifecycle;
    });

    const runsLifecycle = defer<BettererSuiteSummaryΩ>();
    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportSuiteStart = this._reporter.suiteStart(this, runsLifecycle.promise);
    try {
      const runSummaries = await this._runTests(runLifecycles);
      const changed = this._results.getChanged(runSummaries);
      const suiteSummary = new BettererSuiteSummaryΩ(this.filePaths, runSummaries, changed);
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
  private async _runTests(runLifecycles: Array<Defer<BettererRunSummary>>): Promise<BettererRunSummaries> {
    const runsΩ = this.runs as BettererRunsΩ;

    const hasOnly = !!runsΩ.find((run) => run.testMeta.isOnly);
    const { filters } = this._config;

    return Promise.all(
      runsΩ.map(async (runΩ, index) => {
        const lifecycle = runLifecycles[index];

        const isFiltered = filters.length && !filters.some((filter) => filter.test(runΩ.name));
        const isOtherTestOnly = hasOnly && !runΩ.testMeta.isOnly;
        const isSkipped = isFiltered || isOtherTestOnly || runΩ.testMeta.isSkipped;

        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = this._reporter.runStart(runΩ, lifecycle.promise);
        const runSummary = await runΩ.run(isSkipped);

        if (runSummary.isFailed) {
          const { error } = runSummary;
          assert(error);
          lifecycle.reject(error);
          await reportRunStart;
          await this._reporter.runError(runΩ, error as BettererError);
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
