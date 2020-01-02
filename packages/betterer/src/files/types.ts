import { LoggerCodeInfo } from '@betterer/logger';

import { MaybeAsync } from '../types';

export type BettererFileInfo = LoggerCodeInfo;
export type BettererFileInfoMap = Record<string, Array<BettererFileInfo>>;
export type BettererFileMark = [number, number, number, string];
export type BettererFileMarks = Array<BettererFileMark>;
export type BettererFileMarksMap = Record<string, BettererFileMarks>;
export type BettererFileHashMap = Record<string, string>;
export type BettererFileInfoDiff = Record<
  string,
  ReadonlyArray<BettererFileInfo>
>;

export type FileBettererTest = (
  files: ReadonlyArray<string>
) => MaybeAsync<Array<BettererFileInfo>>;
