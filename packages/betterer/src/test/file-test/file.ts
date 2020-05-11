import { BettererFileIssues } from './types';

export class BettererFile {
  public readonly key: string;

  constructor(
    public readonly filePath: string,
    public readonly hash: string,
    public readonly issues: BettererFileIssues
  ) {
    this.key = `${filePath}:${hash}`;
  }
}
