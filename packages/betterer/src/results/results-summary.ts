import type { BettererOptionsResults } from '../api/index.js';
import type { BettererFileTestResultΩ, BettererTestBase } from '../test/index.js';
import type { BettererFileTestResultSummaryDetails, BettererResultsSummary, BettererResultSummaries } from './types.js';

import { BettererError, isBettererError } from '@betterer/errors';
import { BettererFileResolverΩ } from '../fs/index.js';
import { createGlobals } from '../globals.js';
import { isBettererFileTest, isBettererTest, loadTestMeta } from '../test/index.js';

export class BettererResultsSummaryΩ implements BettererResultsSummary {
  public readonly resultSummaries: BettererResultSummaries;

  private constructor(resultSummaries: BettererResultSummaries, onlyFileTests: boolean) {
    this.resultSummaries = onlyFileTests
      ? resultSummaries.filter((resultSummary) => resultSummary.isFileTest)
      : resultSummaries;
  }

  public static async create(options: BettererOptionsResults): Promise<BettererResultsSummary> {
    const { config, results, versionControl } = await createGlobals(options);

    const testMeta = await loadTestMeta(config.configPaths);

    let testMetaEntries = Object.entries(testMeta);
    if (config.filters.length) {
      testMetaEntries = testMetaEntries.filter(([name]) => config.filters.some((filter) => filter.test(name)));
    }

    const { cwd, includes, excludes, resultsPath } = config;

    const resolver = new BettererFileResolverΩ(cwd, versionControl);
    resolver.include(...includes);
    resolver.exclude(...excludes);

    const filePaths = await resolver.files();

    const onlyFileTests = includes.length > 0 || excludes.length > 0;

    const testStatuses = await Promise.all(
      testMetaEntries.map(async ([name, testMeta]) => {
        let test: BettererTestBase | null = null;
        try {
          test = await testMeta.factory();
        } catch (e) {
          if (isBettererError(e)) {
            throw e;
          }
        }
        const isTest = isBettererTest(test);
        const isFileTest = isBettererFileTest(test);

        if (!test || !(isTest || isFileTest)) {
          throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
        }

        const [expectedJSON] = results.getExpected(name);
        const serialised = JSON.parse(expectedJSON) as unknown;
        const deserialised = test.config.serialiser.deserialise(serialised, resultsPath);
        if (isFileTest) {
          const resultΩ = deserialised as BettererFileTestResultΩ;
          const details = resultΩ.files
            .filter((file) => !onlyFileTests || filePaths.includes(file.absolutePath))
            .reduce<BettererFileTestResultSummaryDetails>((summary, file) => {
              summary[file.absolutePath] = file.issues;
              return summary;
            }, {});
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
