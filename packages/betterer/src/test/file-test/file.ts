import * as assert from 'assert';

import { rawToDeserialiseIssue } from './serialiser';
import {
  BettererFileIssues,
  BettererFileIssueRaw,
  BettererFileIssuesRaw,
  BettererFileIssuesDeserialised,
  BettererFile
} from './types';

export class BettererFileΩ implements BettererFile {
  public readonly key: string;

  private _issues: BettererFileIssuesDeserialised;
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
      this._issues = rawToDeserialiseIssue(this._issuesRaw);
    } else {
      this._issues = issues;
    }
  }

  public get issuesRaw(): BettererFileIssuesRaw {
    assert(this._issuesRaw);
    return this._issuesRaw;
  }

  public get issues(): BettererFileIssuesDeserialised {
    return this._issues;
  }
}

function isRaw(issues: BettererFileIssues): issues is BettererFileIssuesRaw {
  const [issue] = issues;
  return (issue as BettererFileIssueRaw).fileText != null;
}
