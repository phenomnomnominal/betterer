import { BettererConstraintResult } from './constraint-result';

/**
 * @public `Betterer` constraint function for when a numeric result is expected to get bigger.
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
