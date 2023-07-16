import type { BettererFileTestResultΩ } from './file-test-result.js';
import type { BettererFileTestResult } from './types.js';

export function goal(result: BettererFileTestResult): boolean {
  const resultΩ = result as BettererFileTestResultΩ;
  return resultΩ.files.filter((file) => file.issues.length).length === 0;
}
