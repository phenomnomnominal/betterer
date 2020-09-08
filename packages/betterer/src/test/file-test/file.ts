import * as assert from 'assert';
import LinesAndColumns from 'lines-and-columns';

import { getConfig } from '../../config';
import { createHash } from '../../hasher';
import { getRelativePath, isString } from '../../utils';
import { BettererFileIssue, BettererFileIssues, BettererFile } from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

type StartEnd = [number, number, string, string?];
type LineColLength = [number, number, number, string, string];
type PositionPosition = [number, number, number, number, string, string?];

type Issue = StartEnd | LineColLength | PositionPosition;

export class BettererFileΩ implements BettererFile {
  public readonly key: string;

  private _issues: BettererFileIssues = [];

  constructor(public readonly absolutePath: string, public readonly hash: string, private _fileText?: string) {
    const { resultsPath } = getConfig();
    const relativePath = getRelativePath(resultsPath, absolutePath);
    this.key = `${relativePath}:${this.hash}`;
  }

  public get fileText(): string {
    assert(this._fileText);
    return this._fileText;
  }

  public get issues(): BettererFileIssues {
    return this._issues;
  }

  public addIssues(issues: BettererFileIssues): void {
    this._issues = [...this._issues, ...issues];
  }

  public addIssue(...issue: Issue): void {
    this.addIssues([handleIssue(issue, this._fileText)]);
  }
}

function handleIssue(issue: Issue, fileText?: string): BettererFileIssue {
  if (isLineColLength(issue)) {
    const [line, column, length, message, hash] = issue;
    return { line, column, length, message, hash };
  }

  assert(fileText);
  const lc = new LinesAndColumns(fileText);
  if (isStartEnd(issue)) {
    const [start, end, message, overrideHash] = issue;
    const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
    const length = end - start;
    const hash = overrideHash || createHash(fileText.substr(start, length));
    return { line, column, length, message, hash };
  }

  const [line, column, endLine, endColumn, message, overrideHash] = issue;
  const start = lc.indexForLocation({ line, column }) || 0;
  const end = lc.indexForLocation({ line: endLine, column: endColumn }) || 0;
  const length = end - start;
  const hash = overrideHash || createHash(fileText.substr(start, length));
  return { line, column, length, message, hash };
}

function isStartEnd(issue: Issue): issue is StartEnd {
  const [, , message] = issue;
  return isString(message);
}

function isLineColLength(issue: Issue): issue is LineColLength {
  const [, , , message] = issue;
  return isString(message);
}
