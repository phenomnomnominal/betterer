import { BettererCoverageIssue } from './types';

export const uncoveredFile: BettererCoverageIssue = {
  lines: Number.MAX_SAFE_INTEGER,
  statements: Number.MAX_SAFE_INTEGER,
  functions: Number.MAX_SAFE_INTEGER,
  branches: Number.MAX_SAFE_INTEGER
};

export function reduceJoinRecords<
  T,
  K1 extends number | string | symbol = string,
  K2 extends number | string | symbol = string
>(union: Record<K1, T>, nextRecord: Record<K2, T>): Record<K1 | K2, T> {
  return { ...union, ...nextRecord };
}
