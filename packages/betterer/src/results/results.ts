import { BettererOptionsResults } from '../config';
import { BettererFilePaths, destroyVersionControl } from '../fs';
import { createGlobals } from '../globals';
import { BettererFileTestResultΩ, isBettererFileTest, loadTestMeta } from '../test';
import { BettererFileTestResults, BettererResults, BettererTestResults } from './types';

export class BettererResultsΩ implements BettererResults {
  public readonly results: BettererTestResults;

  private constructor(results: BettererTestResults, private _filePaths: BettererFilePaths) {
    this.results = this._filePaths.length ? results.filter((result) => result.isFileTest) : results;
  }

  public static async create(options: BettererOptionsResults): Promise<BettererResultsΩ> {
    const { config, resultsFile } = await createGlobals({
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

    const testStatuses = await Promise.all(
      testNames.map(async (name) => {
        const test = await testFactories[name].factory();
        const isFileTest = isBettererFileTest(test);
        const [expectedJSON] = resultsFile.getExpected(name);
        const serialised = JSON.parse(expectedJSON) as unknown;
        const deserialised = test.config.serialiser.deserialise(serialised, config.resultsPath);
        if (isFileTest) {
          const resultΩ = deserialised as BettererFileTestResultΩ;
          const results: BettererFileTestResults = {};
          resultΩ.files
            .filter((file) => config.filePaths.length === 0 || config.filePaths.includes(file.absolutePath))
            .forEach((file) => {
              results[file.absolutePath] = file.issues;
            });
          return { name, isFileTest, results };
        } else {
          const result = await test.config.printer(deserialised);
          return { name, isFileTest, result };
        }
      })
    );

    const status = new BettererResultsΩ(testStatuses, config.filePaths);
    await destroyVersionControl();
    return status;
  }
}
