import type { BettererFileTestResultΩ, BettererTest } from '../test/index.js';
import type { BettererFileTestResultSummaryDetails, BettererResultsSummary, BettererResultSummaries } from './types.js';

import { BettererError, isBettererErrorΔ } from '@betterer/errors';
import { BettererFileResolverΩ } from '../fs/index.js';
import { getGlobals } from '../globals.js';
import { isBettererFileTest, isBettererResolverTest, isBettererTest } from '../test/index.js';
import { loadTestFactory } from '../run/worker-run.js';

export class BettererResultsSummaryΩ implements BettererResultsSummary {
  public readonly resultSummaries: BettererResultSummaries;

  private constructor(resultSummaries: BettererResultSummaries, onlyFileTests: boolean) {
    this.resultSummaries = onlyFileTests
      ? resultSummaries.filter((resultSummary) => resultSummary.isFileTest)
      : resultSummaries;
  }

  public static async create(): Promise<BettererResultsSummary> {
    const { config, results, testMetaLoader, versionControl } = getGlobals();
    const { configPaths, cwd, filters, includes, excludes, resultsPath } = config;

    try {
      let testsMeta = await testMetaLoader.api.loadTestsMeta(configPaths);
      if (filters.length) {
        testsMeta = testsMeta.filter((testMeta) => filters.some((filter) => filter.test(testMeta.name)));
      }

      const resolver = new BettererFileResolverΩ(cwd, versionControl);
      resolver.include(...includes);
      resolver.exclude(...excludes);

      const filePaths = await resolver.files();

      const onlyFileTests = includes.length > 0 || excludes.length > 0;

      const testStatuses = await Promise.all(
        testsMeta.map(async (testMeta) => {
          const { name } = testMeta;
          let test: BettererTest | null = null;
          try {
            const factory = await loadTestFactory(testMeta);
            test = await factory();
          } catch (e) {
            if (isBettererErrorΔ(e)) {
              throw e;
            }
          }
          const isTest = isBettererTest(test);
          const isFileTest = isBettererFileTest(test);
          const isResolverTest = isBettererResolverTest(test);

          if (!test || !(isTest || isFileTest || isResolverTest)) {
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

      return new BettererResultsSummaryΩ(testStatuses, onlyFileTests);
    } catch (e) {
      await config.reporter.configError?.(config, e as BettererError);
      throw e;
    } finally {
      await versionControl.destroy();
    }
  }
}
