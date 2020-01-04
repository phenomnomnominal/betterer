import { BettererLoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../types';

export type BettererFileInfo = BettererLoggerCodeInfo;
export type BettererFilesInfo = Array<BettererFileInfo>;
export type BettererFileInfoMap = Record<string, BettererFilesInfo>;
export type BettererFileMark = [number, number, number, string];
export type BettererFileMarks = Array<BettererFileMark>;
export type BettererFileMarksMap = Record<string, BettererFileMarks>;
export type BettererFileHashMap = Record<string, string>;
export type BettererFileHashes = Array<string>;
export type BettererFileInfoDiff = Record<
  string,
  ReadonlyArray<BettererFileInfo>
>;

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFileExcluded = Array<RegExp>;

export type BettererFileTest = (
  files: BettererFilePaths
) => MaybeAsync<BettererFilesInfo>;
