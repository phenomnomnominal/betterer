import { BettererLoggerCodeInfo } from '@betterer/logger';

import { BettererDiff } from '../../results';
import { MaybeAsync } from '../../types';
import { BettererFilePaths } from '../../watcher';

export type BettererFileIssueRaw = BettererLoggerCodeInfo & {
  hash?: string;
};
export type BettererFileIssuesRaw = ReadonlyArray<BettererFileIssueRaw>;
export type BettererFileIssuesMapRaw = Record<string, BettererFileIssuesRaw>;

export type BettererFileIssueDeserialised = {
  readonly line: number;
  readonly column: number;
  readonly length: number;
  readonly message: string;
  readonly hash: string;
};
export type BettererFileIssuesDeserialised = ReadonlyArray<BettererFileIssueDeserialised>;
export type BettererFileIssuesMapDeserialised = Record<string, BettererFileIssuesDeserialised>;

export type BettererFileIssueSerialised = [number, number, number, string, string];
export type BettererFileIssuesSerialised = ReadonlyArray<BettererFileIssueSerialised>;
export type BettererFileIssuesMapSerialised = Record<string, BettererFileIssuesSerialised>;

export type BettererFileIssues = ReadonlyArray<BettererFileIssueRaw> | ReadonlyArray<BettererFileIssueDeserialised>;

export type BettererFilesDiff = Record<
  string,
  {
    fixed?: ReadonlyArray<BettererFileIssueDeserialised>;
    existing?: ReadonlyArray<BettererFileIssueDeserialised>;
    neww?: ReadonlyArray<BettererFileIssueRaw>;
  }
>;
export type BettererFileTestDiff = BettererDiff<BettererFiles, BettererFilesDiff>;

export type BettererFileTestFunction = (files: BettererFilePaths) => MaybeAsync<BettererFileIssuesMapRaw>;

export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFile = {
  readonly key: string;
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly hash: string;
  readonly issuesRaw: BettererFileIssuesRaw;
  readonly issuesDeserialised: BettererFileIssuesDeserialised;
};

export type BettererFiles = {
  readonly filesΔ: ReadonlyArray<BettererFile>;
  getFileΔ(absolutePath: string): BettererFile | void;
};
