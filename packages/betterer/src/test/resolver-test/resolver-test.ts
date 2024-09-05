import type { BettererRun, BettererWorkerRunΩ } from '../../run/index.js';
import type { BettererFileTestResultΩ } from '../file-test/index.js';
import type {
  BettererFileGlobs,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver
} from '../../fs/index.js';
import type { BettererTestOptions } from '../types.js';

import path from 'node:path';
import { BettererFileResolverΩ } from '../../fs/index.js';
import { getGlobals } from '../../globals.js';
import { BettererTest } from '../test.js';
import { BettererError, invariantΔ } from '@betterer/errors';
import { checkBaseName } from '../utils.js';

/**
 * @public A very common need for a **Betterer** test is to resolve file paths, and include and exclude files
 * from being tested.
 *
 * `BettererResolverTest` provides a wrapper around {@link @betterer/betterer#BettererTest | `BettererTest` }
 * that makes it easier to implement such a test.
 */
export class BettererResolverTest<
  DeserialisedType = unknown,
  SerialisedType = DeserialisedType,
  DiffType = null
> extends BettererTest<DeserialisedType, SerialisedType, DiffType> {
  private _resolverΩ = new BettererFileResolverΩ();

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    super({
      ...options,
      test: async (run: BettererRun): Promise<DeserialisedType> => {
        const runΩ = run as BettererWorkerRunΩ;
        const { versionControl } = getGlobals();
        this._resolverΩ.init(path.dirname(runΩ.testMeta.configPath), versionControl);

        const { filePaths } = runΩ;
        invariantΔ(filePaths, `\`filePaths\` should always exist for a \`BettererResolverTest\` run!`);

        const hasSpecifiedFiles = filePaths.length > 0;

        // Get the maximal set of files that the test could run on:
        const testFiles = await this._resolverΩ.files();

        // Get the set of files that the test will run on:
        let filePathsForThisRun: BettererFilePaths;

        // Specified files will include files from a global `includes`.
        if (hasSpecifiedFiles) {
          // Validate that they are relevant for this file test:
          filePathsForThisRun = await this._resolverΩ.validate(filePaths);
        } else {
          filePathsForThisRun = testFiles;
        }

        let isFullRun = filePathsForThisRun === testFiles;

        if (!run.isNew) {
          const cacheMisses = await versionControl.api.filterCached(run.name, filePathsForThisRun);
          isFullRun = isFullRun && cacheMisses.length === filePathsForThisRun.length;
          filePathsForThisRun = cacheMisses;
        }

        // Set the final files back on the `BettererRun`:
        runΩ.setFilePaths(filePathsForThisRun);
        const result = await options.test(run);
        if (isFullRun) {
          return result;
        }

        // Get any filePaths that have expected issues but weren't included in this run:
        const expectedΩ = runΩ.expected.value as BettererFileTestResultΩ;
        const excludedFilesWithIssues = expectedΩ.files
          .map((file) => file.absolutePath)
          .filter((filePath) => !filePaths.includes(filePath));

        // Filter them based on the resolver:
        const relevantExcludedFilePaths = await this._resolverΩ.validate(excludedFilesWithIssues);

        // Add the existing issues to the new result:
        relevantExcludedFilePaths.forEach((filePath) => {
          const resultΩ = result as BettererFileTestResultΩ;
          resultΩ.addExpected(expectedΩ.getFile(filePath));
        });

        return result;
      }
    });
  }

  /**
   * The file resolver relative to this test's config file. Will only exist while
   * the `test()` function is being executed.
   */
  public get resolver(): BettererFileResolver {
    if (!this._resolverΩ.isInitialised()) {
      throw new BettererError('`resolver` can only be used while the `test` function is being executed. ❌');
    }
    return this._resolverΩ;
  }

  /**
   * Add a list of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression } filters for files to exclude when running the test.
   *
   * @param excludePatterns - RegExp filters to match file paths that should be excluded.
   * @returns This {@link @betterer/betterer#BettererResolverTest | `BettererResolverTest`}, so it is chainable.
   */
  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolverΩ.exclude(...excludePatterns);
    return this;
  }

  /**
   * Add a list of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns for files to include when running the test.
   *
   * @param includePatterns - Glob patterns to match file paths that should be included. All
   * `includes` should be relative to the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   * @returns This {@link @betterer/betterer#BettererResolverTest | `BettererResolverTest`}, so it is chainable.
   */
  public include(...includePatterns: BettererFileGlobs): this {
    this._resolverΩ.include(...includePatterns);
    return this;
  }
}

export function isBettererResolverTest(test: unknown): test is BettererResolverTest {
  if (!test) {
    return false;
  }
  return checkBaseName(test.constructor, BettererResolverTest.name);
}
