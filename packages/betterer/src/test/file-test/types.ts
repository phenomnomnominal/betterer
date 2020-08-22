import { BettererLoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../../types';
import { BettererFilePaths } from '../../watcher';
import { BettererTestOptions } from '../types';
import { BettererFiles } from './files';

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

export type BettererFileTestDiff = Record<
  string,
  {
    fixed?: ReadonlyArray<BettererFileIssueDeserialised>;
    existing?: ReadonlyArray<BettererFileIssueDeserialised>;
    neww?: ReadonlyArray<BettererFileIssueRaw>;
  }
>;

export type BettererFileTestFunction = (files: BettererFilePaths) => MaybeAsync<BettererFileIssuesMapRaw>;

export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;
export type BettererFileTestOptions = BettererTestOptions<BettererFiles, BettererFileIssuesMapSerialised> & {
  included: ReadonlyArray<string>;
  excluded: ReadonlyArray<RegExp>;
};
