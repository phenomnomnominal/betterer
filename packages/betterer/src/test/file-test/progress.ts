import type { BettererDelta } from '../../run/index.js';
import type { BettererFileTestResultΩ } from './file-test-result.js';
import type { BettererFileTestResult } from './types.js';

export function progress(
  baseline: BettererFileTestResult | null,
  result: BettererFileTestResult | null
): BettererDelta | null {
  if (result == null) {
    return null;
  }
  const resultIssues = countIssues(result);
  if (baseline == null) {
    return {
      baseline: null,
      result: resultIssues,
      diff: 0
    };
  }
  const baselineIssues = countIssues(baseline);
  return {
    baseline: baselineIssues,
    diff: resultIssues - baselineIssues,
    result: resultIssues
  };
}

function countIssues(result: BettererFileTestResult): number {
  const resultΩ = result as BettererFileTestResultΩ;
  return resultΩ.files.reduce((sum, file) => sum + file.issues.length, 0);
}
