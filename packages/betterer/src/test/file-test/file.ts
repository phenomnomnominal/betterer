import type { BettererFileIssue, BettererFileIssues, BettererFile } from './types.js';

import assert from 'node:assert';
import { LinesAndColumns } from 'lines-and-columns';

import { createHash } from '../../hasher.js';
import { isString, normalisedPath, normaliseNewlines } from '../../utils.js';

const UNKNOWN_LOCATION = {
  line: 0,
  column: 0
} as const;

type BettererIssueStartEnd = [number, number, string, string?];
type BettererIssueLineColLength = [number, number, number, string, string?];
type BettererIssuePositions = [number, number, number, number, string, string?];
type BettererIssueOverride = BettererIssueStartEnd | BettererIssueLineColLength | BettererIssuePositions;

export class BettererFileΩ implements BettererFile {
  public readonly hash: string;
  public readonly key: string;

  private _issues: BettererFileIssues = [];

  constructor(
    public readonly absolutePath: string,
    private _relativePath: string,
    public readonly fileText: string
  ) {
    this.absolutePath = normalisedPath(absolutePath);
    this.hash = createHash(this.fileText);
    this.key = `${normalisedPath(this._relativePath)}:${this.hash}`;
  }

  public get issues(): BettererFileIssues {
    return this._issues;
  }

  public addIssues(issues: BettererFileIssues): void {
    this._issues = [...this._issues, ...issues];
  }

  public addIssue(...issueOverride: BettererIssueOverride): void {
    this.addIssues([this._handleIssue(issueOverride, this.fileText)]);
  }

  private _handleIssue(issueOverride: BettererIssueOverride, fileText: string): BettererFileIssue {
    const lc = new LinesAndColumns(fileText);

    const issue =
      getIssueFromStartEnd(lc, issueOverride) ||
      getIssueFromLineColLength(issueOverride) ||
      getIssueFromPositions(lc, issueOverride);
    assert(issue);

    const [line, column, length, message, overrideHash] = issue;
    const start = lc.indexForLocation({ line, column }) || 0;
    const issueText = fileText.substring(start, start + length);
    const normalisedText = normaliseNewlines(issueText);
    const hash = overrideHash || createHash(normalisedText);
    return { line, column, length: normalisedText.length, message, hash };
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
