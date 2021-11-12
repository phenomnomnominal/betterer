import { BettererConstraintResult } from './constraint-result';

/**
 * @public `Betterer` {@link @betterer/betterer#BettererTestConstraint | constraint function} for when
 * a numeric result is expected to get bigger.
 *
 * @example
 * ```typescript
 * import { bigger } from '@betterer/constraints';
 *
 * bigger(1, 2); // worse
 * bigger(1, 1); // worse
 * bigger(2, 1); // better
 * bigger(2, 2); // same
 * ```
 *
 * @param result - Result from the current test run.
 * @param expected - Expected result from the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 */
export function bigger(result: number, expected: number): BettererConstraintResult {
  if (result === expected) {
    return BettererConstraintResult.same;
  }
  if (result > expected) {
    return BettererConstraintResult.better;
  }
  return BettererConstraintResult.worse;
}
