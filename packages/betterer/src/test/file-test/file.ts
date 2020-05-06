import { BettererFileIssues } from './types';

export class BettererFile<BettererFileIssueType> {
  constructor(
    public readonly filePath: string,
    public readonly fileHash: string,
    public readonly fileIssues: BettererFileIssues<BettererFileIssueType>
  ) { }
}
