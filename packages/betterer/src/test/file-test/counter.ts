import { BettererFileTestResultΩ } from './file-test-result';
import { BettererFileTestResult } from './types';

export function counter(result: BettererFileTestResult): number {
  const resultΩ = result as BettererFileTestResultΩ;
  return resultΩ.files.reduce((sum, file) => sum + file.issues.length, 0);
}
