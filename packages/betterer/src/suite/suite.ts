import type { BettererError } from '@betterer/errors';

import type { BettererFilePaths } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererRuns } from '../run/index.js';
import type { BettererSuite, BettererSuiteSummary } from './types.js';

import { invariantΔ } from '@betterer/errors';

import { getGlobals } from '../globals.js';
import { BettererResultΩ } from '../results/index.js';
import { BettererRunΩ, BettererRunObsoleteΩ } from '../run/index.js';
import { BettererSuiteSummaryΩ } from './suite-summary.js';

const NEGATIVE_FILTER_TOKEN = '!';

export class BettererSuiteΩ implements BettererSuite {
  public readonly lifecycle = Promise.withResolvers<BettererSuiteSummary>();

  private constructor(
    public filePaths: BettererFilePaths,
    public runs: BettererRuns
  ) {}

  public static async create(filePaths: BettererFilePaths): Promise<BettererSuiteΩ> {
    const { config, results, testMetaLoader } = getGlobals();
    const { configPaths, update } = config;

    const expectedTestNames = await results.api.getExpectedTestNames();

    const testsMeta = await testMetaLoader.api.loadTestsMeta(configPaths);
    const runsΩ = await Promise.all(
      testsMeta.map(async (testMeta) => {
        return await BettererRunΩ.create(testMeta, filePaths);
      })
    );
    const testNames = testsMeta.map((testMeta) => testMeta.name);
    const obsoleteTestNames = expectedTestNames.filter((expectedTestName) => !testNames.includes(expectedTestName));

    const obsoleteRuns = await Promise.all(
      obsoleteTestNames.map(async (testName) => {
        const baselineJSON = await results.api.getBaseline(testName);
        const baseline = new BettererResultΩ(JSON.parse(baselineJSON), baselineJSON);
        return new BettererRunObsoleteΩ(testName, baseline, update);
      })
    );

    return new BettererSuiteΩ(filePaths, [...obsoleteRuns, ...runsΩ]);
  }

  public async run(): Promise<BettererSuiteSummary> {
    const hasOnly = !!this.runs.find((run) => {
      const runΩ = run as BettererRunΩ;
      return runΩ.isOnly;
    });

    const runSummaries = await Promise.all(
      this.runs.map(async (run) => {
        const runΩ = run as BettererRunΩ;

        const { config } = getGlobals();
        const { filters } = config;

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

        const { reporter } = getGlobals();
        const reporterΩ = reporter as BettererReporterΩ;

        // Don't await here! A custom reporter could be awaiting
        // the lifecycle promise which is unresolved right now!
        const reportRunStart = reporterΩ.runStart(runΩ, runΩ.lifecycle.promise);

        const runSummary = await runΩ.run(isFiltered);

        // `filePaths` will be updated in the worker if the test filters the files
        // so it needs to be updated
        runΩ.filePaths = runSummary.filePaths;

        if (runSummary.isFailed) {
          const { error } = runSummary;
          invariantΔ(error, 'A failed run will always have an `error`!');
          runΩ.lifecycle.reject(error);

          // Lifecycle promise is resolved, so it's safe to await
          // the result of `reporter.runStart`:
          await reportRunStart;
          await reporterΩ.runError(runΩ, error as BettererError);
        } else {
          runΩ.lifecycle.resolve(runSummary);

          // Lifecycle promise is resolved, so it's safe to await
          // the result of `reporter.runStart`:
          await reportRunStart;
          await reporterΩ.runEnd(runSummary);
        }
        return runSummary;
      })
    );

    return new BettererSuiteSummaryΩ(this.filePaths, this.runs, runSummaries);
  }
}
