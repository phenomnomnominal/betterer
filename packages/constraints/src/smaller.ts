import { ConstraintResult } from './constraint-result';

export function smaller(current: number, previous: number): ConstraintResult {
  if (current === previous) {
    return ConstraintResult.same;
  }
  if (current < previous) {
    return ConstraintResult.better;
  }
  return ConstraintResult.worse;
}
