import { BettererDelta } from '../../context';
import { BettererFileTestResultΩ } from './file-test-result';
import { BettererFileTestResult } from './types';

export function progress(
  baseline: BettererFileTestResult | null,
  result: BettererFileTestResult | null
): BettererDelta | null {
  // This is a bit complex, but hopefully it makes sense:
  //
  // | Result | Baseline  | Formula                | Percentage % |
  // | -------|-----------|------------------------|--------------|
  // | null   | null      |                        | null         |
  // | 50     | null      |                        | null         |
  // | 99     | 100       | (1 - (99 / 100)) * 100 | 1%           |
  // | 42     | 60        | (1 - (42 / 60)) * 100  | 30%          |
  // | 20     | 15        | (1 - (20 / 15)) * 100  | -33.33%      |
  if (result == null || baseline == null) {
    return null;
  }
  const baselineIssues = countIssues(baseline as BettererFileTestResultΩ);
  const resultIssues = countIssues(result as BettererFileTestResultΩ);
  return {
    baseline: baselineIssues,
    diff: baselineIssues - resultIssues,
    result: resultIssues,
    percentage: (1 - resultIssues / baselineIssues) * 100
  };
}

function countIssues(result: BettererFileTestResultΩ): number {
  return result.files.reduce((sum, file) => sum + file.issues.length, 0);
}
