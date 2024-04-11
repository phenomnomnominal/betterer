import type { BettererOptionsResults } from '../api/index.js';
import type { BettererFileTestResultΩ } from '../test/index.js';
import type { BettererFileTestResultSummaryDetails, BettererResultsSummary, BettererResultSummaries } from './types.js';

import { BettererFileResolverΩ } from '../fs/index.js';
import { createGlobals } from '../globals.js';
import { isBettererFileTest, loadTestMeta } from '../test/index.js';

export class BettererResultsSummaryΩ implements BettererResultsSummary {
  public readonly resultSummaries: BettererResultSummaries;

  private constructor(resultSummaries: BettererResultSummaries, onlyFileTests: boolean) {
    this.resultSummaries = onlyFileTests
      ? resultSummaries.filter((resultSummary) => resultSummary.isFileTest)
      : resultSummaries;
  }

  public static async create(options: BettererOptionsResults): Promise<BettererResultsSummary> {
    const { config, results, versionControl } = await createGlobals(options);

    const testFactories = loadTestMeta(config.configPaths);

    let testNames = Object.keys(testFactories);
    if (config.filters.length) {
      testNames = testNames.filter((name) => config.filters.some((filter) => filter.test(name)));
    }

    const { cwd, includes, excludes, resultsPath } = config;

    const resolver = new BettererFileResolverΩ(cwd, versionControl);
    resolver.include(...includes);
    resolver.exclude(...excludes);

    const filePaths = await resolver.files();

    const onlyFileTests = includes.length > 0 || excludes.length > 0;

    const testStatuses = await Promise.all(
      testNames.map(async (name) => {
        const test = await testFactories[name].factory();
        const isFileTest = isBettererFileTest(test);
        const [expectedJSON] = results.getExpected(name);
        const serialised = JSON.parse(expectedJSON) as unknown;
        const deserialised = test.config.serialiser.deserialise(serialised, resultsPath);
        if (isFileTest) {
          const resultΩ = deserialised as BettererFileTestResultΩ;
          const details = resultΩ.files
            .filter((file) => !onlyFileTests || filePaths.includes(file.absolutePath))
            .reduce((summary, file) => {
              summary[file.absolutePath] = file.issues;
              return summary;
            }, {} as BettererFileTestResultSummaryDetails);
          return { name, isFileTest, details };
        } else {
          const details = await test.config.printer(deserialised);
          return { name, isFileTest, details };
        }
      })
    );

    const status = new BettererResultsSummaryΩ(testStatuses, onlyFileTests);
    await versionControl.destroy();
    return status;
  }
}
