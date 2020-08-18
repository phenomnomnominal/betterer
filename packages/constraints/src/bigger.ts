import { BettererConstraintResult } from './constraint-result';

export function bigger(result: number, expected: number): BettererConstraintResult {
  if (result === expected) {
    return BettererConstraintResult.same;
  }
  if (result > expected) {
    return BettererConstraintResult.better;
  }
  return BettererConstraintResult.worse;
}
