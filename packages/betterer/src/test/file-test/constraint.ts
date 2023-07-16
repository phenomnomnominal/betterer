import type { BettererFileTestResult } from './types';

import { BettererConstraintResult } from '@betterer/constraints';

import { differ } from './differ';

export function constraint(result: BettererFileTestResult, expected: BettererFileTestResult): BettererConstraintResult {
  const { diff } = differ(expected, result);

  const filePaths = Object.keys(diff);

  if (filePaths.length === 0) {
    return BettererConstraintResult.same;
  }

  const hasNew = filePaths.filter((filePath) => !!diff[filePath].new?.length);

  if (hasNew.length) {
    return BettererConstraintResult.worse;
  }

  const hasFixed = filePaths.filter((filePath) => !!diff[filePath].fixed?.length);

  if (hasFixed.length) {
    return BettererConstraintResult.better;
  }

  return BettererConstraintResult.same;
}
