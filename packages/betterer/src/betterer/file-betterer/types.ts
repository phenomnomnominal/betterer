import { BettererLoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../../types';

export type BettererFileInfo = BettererLoggerCodeInfo;
export type BettererFileInfoMap = Record<string, ReadonlyArray<BettererFileInfo>>;
export type BettererFileMark = readonly [number, number, number, string];
export type BettererFileMarks = ReadonlyArray<BettererFileMark>;
export type BettererFileMarksMap = Record<string, BettererFileMarks>;
export type BettererFileHashMap = Record<string, string>;
export type BettererFileHashes = ReadonlyArray<string>;
export type BettererFileInfoDiff = Record<string, ReadonlyArray<BettererFileInfo>>;

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFileExcluded = ReadonlyArray<RegExp>;

export type BettererFileTest = (files: BettererFilePaths) => MaybeAsync<BettererFileInfoMap>;
