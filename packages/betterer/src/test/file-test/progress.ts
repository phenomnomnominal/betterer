import { BettererDelta } from '../../run';
import { BettererFileTestResultΩ } from './file-test-result';
import { BettererFileTestResult } from './types';

export function progress(
  baseline: BettererFileTestResult | null,
  result: BettererFileTestResult | null
): BettererDelta | null {
  if (result == null) {
    return null;
  }
  const resultIssues = countIssues(result as BettererFileTestResultΩ);
  if (baseline == null) {
    return {
      baseline: null,
      result: resultIssues,
      diff: 0
    };
  }
  const baselineIssues = countIssues(baseline as BettererFileTestResultΩ);
  return {
    baseline: baselineIssues,
    diff: resultIssues - baselineIssues,
    result: resultIssues
  };
}

function countIssues(result: BettererFileTestResultΩ): number {
  return result.files.reduce((sum, file) => sum + file.issues.length, 0);
}
