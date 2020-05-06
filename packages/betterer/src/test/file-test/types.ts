import { BettererLoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../../types';
import { BettererFilePaths } from '../../watcher';
import { BettererTestOptions } from '../types';
import { BettererFiles } from './files';

export { BettererFilePaths } from '../../watcher';

export type BettererFileIssue = BettererLoggerCodeInfo & {
    hash?: string;
};
export type BettererFileIssues<BettererFileIssuesType> = ReadonlyArray<BettererFileIssuesType>;
export type BettererFileIssueMap<BettererFileIssuesType> = Record<string, ReadonlyArray<BettererFileIssuesType>>;

export type BettererFileIssueDeserialised = {
    readonly line: number,
    readonly column: number,
    readonly length: number,
    readonly message: string,
    readonly hash: string,
};

export type BettererFileIssueSerialised = [number, number, number, string, string];

export type BettererFileHashMap = Record<string, string>;

export type BettererFileHashes = ReadonlyArray<string>;

export type BettererFileTestDiff = Record<string, {
    existing?: ReadonlyArray<BettererFileIssueDeserialised | BettererFileIssue>,
    neww?: ReadonlyArray<BettererFileIssue>,
}>;

export type BettererFileTestFunction = (files: BettererFilePaths) => MaybeAsync<BettererFileIssueMap<BettererFileIssue>>;

export type BettererFilesResult = BettererFiles<BettererFileIssue>
export type BettererFilesDeserialised = BettererFiles<BettererFileIssueDeserialised>
export type BettererFileIssuesMapSerialised = BettererFileIssueMap<BettererFileIssueSerialised>

export type BettererFileExcluded = ReadonlyArray<RegExp>;
export type BettererFileTestOptions = BettererTestOptions<BettererFilesResult, BettererFilesDeserialised, BettererFileIssuesMapSerialised> & {
    excluded: BettererFileExcluded
}
