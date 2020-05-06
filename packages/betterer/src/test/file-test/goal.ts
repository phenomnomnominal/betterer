import { BettererFilesResult } from './types';

export function goal(value: BettererFilesResult): boolean {
  return value.files.every((file) => file.fileIssues.length === 0);
}
