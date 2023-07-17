import type { BettererCoverageDiff, BettererCoverageIssues } from './types.js';

import { BettererConstraintResult } from '@betterer/constraints';

import { differ } from './differ.js';

export function constraint(result: BettererCoverageIssues, expected: BettererCoverageIssues): BettererConstraintResult {
  const { diff } = differ(result, expected);
  if (isWorse(diff)) {
    return BettererConstraintResult.worse;
  }
  if (isBetter(diff)) {
    return BettererConstraintResult.better;
  }
  return BettererConstraintResult.same;
}

function isWorse(diff: BettererCoverageDiff): boolean {
  return Object.keys(diff).some((filePath) => {
    const { lines, statements, functions, branches } = diff[filePath];
    return lines < 0 || statements < 0 || functions < 0 || branches < 0;
  });
}

function isBetter(diff: BettererCoverageDiff): boolean {
  return Object.keys(diff).some((filePath) => {
    const { lines, statements, functions, branches } = diff[filePath];
    return lines > 0 || statements > 0 || functions > 0 || branches > 0;
  });
}
