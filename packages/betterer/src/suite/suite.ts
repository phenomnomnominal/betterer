import type { BettererError } from '@betterer/errors';

import type { BettererFilePaths } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererReporterRun, BettererRunSummary, BettererRuns } from '../run/index.js';
import type { BettererSuite } from './types.js';

import { invariantΔ } from '@betterer/errors';

import { defer } from '../utils.js';
import { BettererSuiteSummaryΩ } from './suite-summary.js';
import { BettererRunΩ } from '../run/index.js';
import { getGlobals } from '../globals.js';

const NEGATIVE_FILTER_TOKEN = '!';

export class BettererSuiteΩ implements BettererSuite {
  private constructor(
    public filePaths: BettererFilePaths,
    public runs: BettererRuns
  ) {}

  public static async create(filePaths: BettererFilePaths): Promise<BettererSuiteΩ> {
    const { config, runWorkerPool, testMetaLoader } = getGlobals();
    const { configPaths } = config;

    const testsMeta = await testMetaLoader.api.loadTestsMeta(configPaths);
    const runsΩ = await Promise.all(
      testsMeta.map(async (testMeta) => {
        return await BettererRunΩ.create(runWorkerPool, testMeta, filePaths);
      })
    );

    return new BettererSuiteΩ(filePaths, runsΩ);
  }

  public async run(): Promise<BettererSuiteSummaryΩ> {
    const hasOnly = !!this.runs.find((run) => {
      const runΩ = run as BettererRunΩ;
      return runΩ.isOnly;
    });

    const runSummaries = await Promise.all(
      this.runs.map(async (run) => {
        // Attach lifecycle promise for Reporters:
        const lifecycle = defer<BettererRunSummary>();
        (run as BettererReporterRun).lifecycle = lifecycle.promise;

        const runΩ = run as BettererRunΩ;

        const { config } = getGlobals();
        const { filters, reporter } = config;
        const reporterΩ = reporter as BettererReporterΩ;

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

        const isOtherTestOnly = hasOnly && !runΩ.isOnly;
        const isFiltered = (hasFilters && !isSelected) || isOtherTestOnly;

        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = reporterΩ.runStart(runΩ, lifecycle.promise);

        const runSummary = await runΩ.run(isFiltered);

        // `filePaths` will be updated in the worker if the test filters the files
        // so it needs to be updated
        runΩ.filePaths = runSummary.filePaths;

        if (runSummary.isFailed) {
          const { error } = runSummary;
          invariantΔ(error, 'A failed run will always have an `error`!');
          lifecycle.reject(error);
          await reportRunStart;
          await reporterΩ.runError(runΩ, error as BettererError);
        } else {
          lifecycle.resolve(runSummary);
          await reportRunStart;
          await reporterΩ.runEnd(runSummary);
        }
        return runSummary;
      })
    );

    const { results } = getGlobals();
    const changed = results.getChanged(runSummaries);

    return new BettererSuiteSummaryΩ(this.filePaths, this.runs, runSummaries, changed);
  }
}
