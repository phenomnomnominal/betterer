import assert from 'assert';
import LinesAndColumns from 'lines-and-columns';

import { getConfig } from '../../config';
import { createHash } from '../../hasher';
import { getRelativePath, isString } from '../../utils';
import { BettererFileResolverΩ } from './file-resolver';
import { BettererFileIssue, BettererFileIssues, BettererFile } from './types';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

type BettererIssueStartEnd = [number, number, string, string?];
type BettererIssueLineColLength = [number, number, number, string, string?];
type BettererIssuePositions = [number, number, number, number, string, string?];
type BettererIssueOverride = BettererIssueStartEnd | BettererIssueLineColLength | BettererIssuePositions;

export class BettererFileΩ implements BettererFile {
  public readonly absolutePath: string;
  public readonly key: string;

  private _issues: BettererFileIssues = [];

  constructor(
    absolutePath: string,
    public readonly hash: string,
    private _resolver: BettererFileResolverΩ,
    private _fileText: string
  ) {
    this.absolutePath = this._resolver.resolve(absolutePath);
    const { resultsPath } = getConfig();
    const relativePath = getRelativePath(resultsPath, absolutePath);
    this.key = `${relativePath}:${this.hash}`;
  }

  public get fileText(): string {
    return this._fileText;
  }

  public get issues(): BettererFileIssues {
    return this._issues;
  }

  public addIssues(issues: BettererFileIssues): void {
    this._issues = [...this._issues, ...issues];
  }

  public addIssue(...issueOverride: BettererIssueOverride): void {
    this.addIssues([this._handleIssue(issueOverride, this._fileText)]);
  }

  private _handleIssue(issueOverride: BettererIssueOverride, fileText: string): BettererFileIssue {
    const lc = new LinesAndColumns(fileText);

    const issue =
      getIssueFromLineColLength(issueOverride) ||
      getIssueFromStartEnd(lc, issueOverride) ||
      getIssueFromPositions(lc, issueOverride);
    assert(issue);

    const [line, column, length, message, overrideHash] = issue;
    const start = lc.indexForLocation({ line, column }) || 0;
    const hash = overrideHash || createHash(fileText.substr(start, length));
    return { line, column, length, message: this._forceRelativePaths(message), hash };
  }

  private _forceRelativePaths(message: string): string {
    return message.replace(new RegExp(this._resolver.cwd, 'g'), '.');
  }
}

function getIssueFromLineColLength(issueOverride: BettererIssueOverride): BettererIssueLineColLength | null {
  if (!isLineColLength(issueOverride)) {
    return null;
  }
  return issueOverride;
}

function isLineColLength(issueOverride: BettererIssueOverride): issueOverride is BettererIssueLineColLength {
  const [, , , message] = issueOverride;
  return isString(message);
}

function getIssueFromStartEnd(
  lc: LinesAndColumns,
  issueOverride: BettererIssueOverride
): BettererIssueLineColLength | null {
  if (!isStartEnd(issueOverride)) {
    return null;
  }
  const [start, end, message, overrideHash] = issueOverride;
  const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
  const length = end - start;
  return [line, column, length, message, overrideHash];
}

function isStartEnd(issueOverride: BettererIssueOverride): issueOverride is BettererIssueStartEnd {
  const [, , message] = issueOverride;
  return isString(message);
}

function getIssueFromPositions(
  lc: LinesAndColumns,
  issueOverride: BettererIssueOverride
): BettererIssueLineColLength | null {
  if (!isPositions(issueOverride)) {
    return null;
  }
  const [line, column, endLine, endColumn, message, overrideHash] = issueOverride;
  const start = lc.indexForLocation({ line, column }) || 0;
  const end = lc.indexForLocation({ line: endLine, column: endColumn }) || 0;
  const length = end - start;
  return [line, column, length, message, overrideHash];
}

function isPositions(issueOverride: BettererIssueOverride): issueOverride is BettererIssuePositions {
  const [, , , , message] = issueOverride;
  return isString(message);
}
