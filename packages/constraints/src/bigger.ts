import { ConstraintResult } from './constraint-result';

export function bigger(result: number, expected: number): ConstraintResult {
  if (result === expected) {
    return ConstraintResult.same;
  }
  if (result > expected) {
    return ConstraintResult.better;
  }
  return ConstraintResult.worse;
}
