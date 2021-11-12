import { BettererOptionsResults } from '../config';
import { BettererFileResolverΩ } from '../fs';
import { createGlobals } from '../globals';
import { BettererFileTestResultΩ, isBettererFileTest, loadTestMeta } from '../test';
import { BettererFileTestResultSummaryDetails, BettererResultsSummary, BettererResultSummaries } from './types';

export class BettererResultsSummaryΩ implements BettererResultsSummary {
  public readonly resultSummaries: BettererResultSummaries;

  private constructor(resultSummaries: BettererResultSummaries, onlyFileTests: boolean) {
    this.resultSummaries = onlyFileTests
      ? resultSummaries.filter((resultSummary) => resultSummary.isFileTest)
      : resultSummaries;
  }

  public static async create(options: BettererOptionsResults): Promise<BettererResultsSummaryΩ> {
    const { config, resultsFile, versionControl } = await createGlobals({
      configPaths: options.configPaths,
      cwd: options.cwd,
      excludes: options.excludes,
      filters: options.filters,
      includes: options.includes,
      resultsPath: options.resultsPath
    });

    const testFactories = loadTestMeta(config);

    let testNames = Object.keys(testFactories);
    if (config.filters.length) {
      testNames = testNames.filter((name) => config.filters.some((filter) => filter.test(name)));
    }

    const resolver = new BettererFileResolverΩ(config.cwd, versionControl);
    resolver.include(...config.includes);
    resolver.exclude(...config.excludes);
    const filePaths = await resolver.files();

    const onlyFileTests = filePaths.length > 0;

    const testStatuses = await Promise.all(
      testNames.map(async (name) => {
        const test = await testFactories[name].factory();
        const isFileTest = isBettererFileTest(test);
        const [expectedJSON] = resultsFile.getExpected(name);
        const serialised = JSON.parse(expectedJSON) as unknown;
        const deserialised = test.config.serialiser.deserialise(serialised, config.resultsPath);
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
