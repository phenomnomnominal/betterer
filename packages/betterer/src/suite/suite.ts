import type { BettererError } from '@betterer/errors';

import type { BettererConfig } from '../config/index.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererResultsΩ } from '../results/index.js';
import type {
  BettererReporterRun,
  BettererRunSummary,
  BettererRunΩ,
  BettererRuns,
  BettererRunsΩ
} from '../run/index.js';
import type { BettererSuite } from './types.js';

import assert from 'node:assert';

import { write } from '../fs/index.js';
import { defer } from '../utils.js';
import { BettererSuiteSummaryΩ } from './suite-summary.js';

const NEGATIVE_FILTER_TOKEN = '!';

export class BettererSuiteΩ implements BettererSuite {
  private _reporter: BettererReporterΩ;

  constructor(
    private _config: BettererConfig,
    private _results: BettererResultsΩ,
    public filePaths: BettererFilePaths,
    public runs: BettererRuns
  ) {
    this._reporter = this._config.reporter as BettererReporterΩ;
  }

  public async run(isRunOnce = false): Promise<BettererSuiteSummaryΩ> {
    const runsΩ = this.runs as BettererRunsΩ;

    const hasOnly = !!runsΩ.find((run) => run.testMeta.isOnly);
    const { filters } = this._config;

    const runSummaries = await Promise.all(
      this.runs.map(async (run) => {
        // Attach lifecycle promise for Reporters:
        const lifecycle = defer<BettererRunSummary>();
        (run as BettererReporterRun).lifecycle = lifecycle.promise;

        const runΩ = run as BettererRunΩ;

        // This is all a bit backwards because "filters" is named badly.
        const hasFilters = !!filters.length;

        // And this is some madness which applies filters and negative filters in
        // the order they are read:
        //
        // ["foo"] => [/foo/] => ["foo"]
        // ["foo"] => [/bar/] => []
        // ["foo"] => [/!foo/] => []
        // ["foo"] => [/!bar/] => ["foo"]
        // ["foo"] => [/foo/, /!foo/] => []
        // ["foo"] => [/!foo/, /foo/] => ["foo"]
        const isSelected = filters.reduce((selected, filter) => {
          const isNegated = filter.source.startsWith(NEGATIVE_FILTER_TOKEN);
          if (selected) {
            if (isNegated) {
              const negativeFilter = new RegExp(filter.source.substring(1), filter.flags);
              return !negativeFilter.test(runΩ.name);
            }
            return selected;
          } else {
            if (isNegated) {
              const negativeFilter = new RegExp(filter.source.substring(1), filter.flags);
              return !negativeFilter.test(runΩ.name);
            }
            return filter.test(runΩ.name);
          }
        }, false);

        const isOtherTestOnly = hasOnly && !runΩ.testMeta.isOnly;
        const isSkipped = (hasFilters && !isSelected) || isOtherTestOnly || runΩ.testMeta.isSkipped;

        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = this._reporter.runStart(runΩ, lifecycle.promise);
        const runSummary = await runΩ.run(isSkipped);

        // `filePaths` will be updated in the worker if the test filters the files
        // so it needs to be updated
        runΩ.filePaths = runSummary.filePaths;

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

    const changed = this._results.getChanged(runSummaries);

    const suiteSummaryΩ = new BettererSuiteSummaryΩ(this.filePaths, this.runs, runSummaries, changed);

    if (!isRunOnce && !this._config.ci) {
      const printedNew = this._results.printNew(suiteSummaryΩ);
      if (printedNew) {
        await write(printedNew, this._config.resultsPath);
      }
    }

    return suiteSummaryΩ;
  }
}
