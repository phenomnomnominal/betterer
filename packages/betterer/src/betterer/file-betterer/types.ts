import { BettererLoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../../types';

export type BettererFileInfo = BettererLoggerCodeInfo;
export type BettererFileInfoMap = Record<string, ReadonlyArray<BettererFileInfo>>;
export type BettererFileIssue = {
    readonly line: number,
    readonly col: number,
    readonly length: number,
    readonly message: string,
    readonly hash: string
};
export type BettererFileIssues = ReadonlyArray<BettererFileIssue>;
export type BettererFileIssuesMap = Record<string, BettererFileIssues>;
export type BettererFileHashMap = Record<string, string>;
export type BettererFileHashes = ReadonlyArray<string>;
export type BettererFileInfoDiff = Record<string, {
    new?: ReadonlyArray<BettererFileInfo>,
    existing?: ReadonlyArray<BettererFileInfo>
}>;

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFileExcluded = ReadonlyArray<RegExp>;

export type BettererFileTest = (files: BettererFilePaths) => MaybeAsync<BettererFileInfoMap>;
