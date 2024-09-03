import type { BettererFileTestResult } from './types.js';

import { BettererConstraintResult } from '@betterer/constraints';

import { differ } from './differ.js';

export function constraint(result: BettererFileTestResult, expected: BettererFileTestResult): BettererConstraintResult {
  const { diff } = differ(expected, result);

  const filePaths = Object.entries(diff);

  if (filePaths.length === 0) {
    return BettererConstraintResult.same;
  }

  const hasNew = filePaths.filter(([, fileDiff]) => !!fileDiff.new?.length);

  if (hasNew.length) {
    return BettererConstraintResult.worse;
  }

  const hasFixed = filePaths.filter(([, fileDiff]) => !!fileDiff.fixed?.length);

  if (hasFixed.length) {
    return BettererConstraintResult.better;
  }

  return BettererConstraintResult.same;
}
