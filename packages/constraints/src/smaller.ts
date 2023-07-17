import { BettererConstraintResult } from './constraint-result.js';

/**
 * @public `Betterer` {@link @betterer/betterer#BettererTestConstraint | constraint function} for
 * when a numeric result is expected to get smaller.
 *
 * @example
 * ```typescript
 * import { smaller } from '@betterer/constraints';
 *
 * smaller(2, 1); // worse
 * smaller(1, 1); // worse
 * smaller(1, 2); // better
 * smaller(2, 2); // same
 * ```
 *
 * @param result - Result from the current test run.
 * @param expected - Expected result from the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
 */
export function smaller(result: number, expected: number): BettererConstraintResult {
  if (result === expected) {
    return BettererConstraintResult.same;
  }
  if (result < expected) {
    return BettererConstraintResult.better;
  }
  return BettererConstraintResult.worse;
}
