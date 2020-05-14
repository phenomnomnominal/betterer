import * as assert from 'assert';

import {
  BettererFileIssues,
  BettererFileIssueRaw,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised
} from './types';

export class BettererFile {
  public readonly key: string;

  private _issuesDeserialised: BettererFileIssuesDeserialised | null = null;
  private _issuesRaw: BettererFileIssuesRaw | null = null;

  constructor(
    public readonly relativePath: string,
    public readonly absolutePath: string,
    public readonly hash: string,
    issues: BettererFileIssues
  ) {
    this.key = `${relativePath}:${hash}`;

    if (isRaw(issues)) {
      this._issuesRaw = issues;
    } else {
      this._issuesDeserialised = issues;
    }
  }

  public get issuesRaw(): BettererFileIssuesRaw {
    assert(this._issuesRaw);
    return this._issuesRaw;
  }

  public get issuesDeserialised(): BettererFileIssuesDeserialised {
    assert(this._issuesDeserialised);
    return this._issuesDeserialised;
  }
}

function isRaw(issues: BettererFileIssues): issues is BettererFileIssuesRaw {
  const [issue] = issues;
  return (issue as BettererFileIssueRaw).fileText != null;
}
