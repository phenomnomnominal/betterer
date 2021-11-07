import assert from 'assert';
import path from 'path';

import { BettererFileResolverΩ, BettererFileGlobs, BettererFilePatterns } from '../../fs';
import { BettererRun, BettererWorkerRunΩ } from '../../run';
import { createDeadline, createGoal, createTestConfig } from '../config';
import { BettererTestConstraint, BettererTestDeadline, BettererTestFunction, BettererTestGoal } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFileTestResultΩ } from './file-test-result';
import { goal } from './goal';
import { printer } from './printer';
import { progress } from './progress';
import { deserialise, serialise } from './serialiser';
import {
  BettererFileTestBase,
  BettererFileTestConfig,
  BettererFileTestFunction,
  BettererFileTestResult
} from './types';

/**
 * @public A very common usecase for **Betterer** is to track issues across all the files in a
 * project. `BettererFileTest` provides a wrapper around {@link @betterer/betterer#BettererTest | `BettererTest` }
 * that makes it easier to implement such a test.
 *
 * @remarks
 * `BettererFileTest` provides a useful example for the more complex possibilities of the {@link @betterer/betterer#BettererTestOptions | `BettererTestOptions` }
 * interface.
 *
 * @example
 * ```typescript
 * const fileTest = new BettererFileTest(async (filePaths, fileTestResult) => {
 *    await Promise.all(
 *      filePaths.map(async (filePath) => {
 *        const fileContents = await fs.readFile(filePath, 'utf8');
 *        const file = fileTestResult.addFile(filePath, fileContents);
 *        file.addIssue(0, 1, `There's something wrong with this file!`);
 *      })
 *    );
 *  });
 * ```
 *
 * @params fileTest The test function which will detect issues in specific files.
 */
export class BettererFileTest implements BettererFileTestBase {
  /**
   * The complete configuration for the test.
   */
  public readonly config: BettererFileTestConfig;

  private _isOnly = false;
  private _isSkipped = false;
  private _resolver: BettererFileResolverΩ;

  constructor(fileTest: BettererFileTestFunction) {
    this._resolver = new BettererFileResolverΩ();
    this.config = createTestConfig({
      test: createTest(this._resolver, fileTest),
      constraint,
      goal,
      serialiser: { deserialise, serialise },
      differ,
      printer,
      progress
    }) as BettererFileTestConfig;
  }

  /**
   * When `true`, all other tests will be skipped. Calling `only()` will set this to `true`.
   */
  public get isOnly(): boolean {
    return this._isOnly;
  }

  /**
   * When `true`, this test will be skipped. Calling `skip()` will set this to `true`.
   */
  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  /**
   * Override the constraint in the test configuration.
   *
   * @param constraintOverride - the new constraint for the test.
   * @returns this test, so it is chainable.
   */
  public constraint(constraintOverride: BettererTestConstraint<BettererFileTestResult>): this {
    this.config.constraint = constraintOverride;
    return this;
  }

  /**
   * Override the deadline in the test configuration.
   *
   * @param deadlineOverride - the new deadline for the test.
   * @returns this test, so it is chainable.
   */
  public deadline(deadlineOverride: BettererTestDeadline): this {
    this.config.deadline = createDeadline({ ...this.config, deadline: deadlineOverride });
    return this;
  }

  /**
   * Add a list of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression } filters for files to exclude when running the test.
   *
   * @param excludePatterns - RegExp filters to match file paths that should be excluded.
   * @returns this test, so it is chainable.
   */
  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolver.exclude(...excludePatterns);
    return this;
  }

  /**
   * Override the goal in the test configuration.
   *
   * @param goalOverride - the new goal for the test.
   * @returns this test, so it is chainable.
   */
  public goal(goalOverride: BettererTestGoal<BettererFileTestResult>): this {
    this.config.goal = createGoal({ ...this.config, goal: goalOverride });
    return this;
  }

  /**
   * Add a list of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns for files to include when running the test.
   *
   * @param includePatterns - glob patterns to match file paths that should be included. All
   * `includes` should be relative to the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   * @returns this test, so it is chainable.
   */
  public include(...includePatterns: BettererFileGlobs): this {
    this._resolver.include(...includePatterns);
    return this;
  }

  /**
   * Run only this test. All other tests will be marked as skipped.
   *
   * @returns this test, so it is chainable.
   */
  public only(): this {
    this._isOnly = true;
    return this;
  }

  /**
   * Skip this test.
   *
   * @returns this test, so it is chainable.
   */
  public skip(): this {
    this._isSkipped = true;
    return this;
  }
}

function createTest(
  resolver: BettererFileResolverΩ,
  fileTest: BettererFileTestFunction
): BettererTestFunction<BettererFileTestResult> {
  return async (run: BettererRun): Promise<BettererFileTestResult> => {
    const runΩ = run as BettererWorkerRunΩ;
    assert(runΩ.filePaths);

    const baseDirectory = path.dirname(runΩ.test.configPath);

    const { config, versionControl } = runΩ.globals;
    resolver.init(baseDirectory, versionControl, config);

    const hasSpecifiedFiles = runΩ.filePaths.length > 0;
    runΩ.filePaths = hasSpecifiedFiles ? await resolver.validate(runΩ.filePaths) : await resolver.files();

    const runFiles = runΩ.isNew ? runΩ.filePaths : await versionControl.filterCached(run.name, runΩ.filePaths);

    const cacheHit = runΩ.filePaths.length !== runFiles.length;
    const isPartial = hasSpecifiedFiles || cacheHit;

    const result = new BettererFileTestResultΩ(resolver);
    await fileTest(runFiles, result, resolver);

    if (!isPartial || runΩ.isNew) {
      return result;
    }

    // Get any filePaths that have expected issues but weren't included in this run:
    const expectedΩ = runΩ.expected.value as BettererFileTestResultΩ;
    const excludedFilesWithIssues = expectedΩ.files
      .map((file) => file.absolutePath)
      .filter((filePath) => !runFiles.includes(filePath));

    // Filter them based on the resolver:
    const relevantExcludedFilePaths = await resolver.validate(excludedFilesWithIssues);

    // Add the existing issues to the new result:
    relevantExcludedFilePaths.forEach((filePath) => result.addExpected(expectedΩ.getFile(filePath)));

    return result;
  };
}

export function isBettererFileTest(test: unknown): test is BettererFileTest {
  return !!test && (test as BettererFileTest).constructor.name === BettererFileTest.name;
}
