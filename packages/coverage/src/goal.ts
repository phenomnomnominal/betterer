import { BettererCoverageIssues } from './types';

export function goal(result: BettererCoverageIssues): boolean {
  return Object.keys(result).every((filePath) => {
    const { lines, statements, functions, branches } = result[filePath];
    return lines === 0 && statements === 0 && functions === 0 && branches === 0;
  });
}
