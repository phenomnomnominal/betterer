import { BettererFileGlobs, BettererFilePatterns, BettererRun, BettererTest } from '@betterer/betterer';

import { constraint } from './constraint';
import { differ } from './differ';
import { goal } from './goal';
import { deserialise, serialise } from './serialiser';
import { BettererCoverageDiff, BettererCoverageIssues, BettererCoverageTestFunction } from './types';
import { flatten } from './utils';

/**
 * @public `BettererCoverageTest` provides a wrapper around {@link @betterer/betterer#BettererTest | `BettererTest` }
 * that makes it easier to implement coverage tests.
 *
 * @remarks `BettererCoverageTest` provides a useful example for the more complex possibilities of the {@link @betterer/betterer#BettererTestOptions | `BettererTestOptions` }
 * interface.
 */
export class BettererCoverageTest extends BettererTest<
  BettererCoverageIssues,
  BettererCoverageIssues,
  BettererCoverageDiff
> {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  /**
   * @internal This could change at any point! Please don't use!
   *
   * You should not construct a `BettererCoverageTest` directly.
   */
  constructor(test: BettererCoverageTestFunction, coverageSummaryPath = './coverage/coverage-summary.json') {
    super({
      test: (run: BettererRun) => test(run, coverageSummaryPath, this._included, this._excluded),
      constraint,
      differ,
      goal,
      serialiser: {
        serialise,
        deserialise
      }
    });
  }

  /**
   * Add a list of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression } filters for files to exclude when running the test.
   *
   * @param excludePatterns - RegExp filters to match file paths that should be excluded.
   * @returns This {@link @betterer/coverage#BettererCoverageTest | `BettererCoverageTest`}, so it is chainable.
   */
  public exclude(...excludePatterns: BettererFilePatterns): this {
    if (!this._included.length) {
      this.include('**/*');
    }
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  /**
   * Add a list of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns for files to include when running the test.
   *
   * @param includePatterns - Glob patterns to match file paths that should be included. All
   * `includes` should be relative to the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   * @returns This {@link @betterer/coverage#BettererCoverageTest | `BettererCoverageTest`}, so it is chainable.
   */
  public include(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns)];
    return this;
  }
}
