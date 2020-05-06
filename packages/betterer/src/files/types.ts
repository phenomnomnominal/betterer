import { BettererLoggerCodeInfo } from '@betterer/logger';

export type BettererFileInfo = BettererLoggerCodeInfo;
export type BettererFileInfoMap = Record<string, Array<BettererFileInfo>>;
export type BettererFileMark = [number, number, number, string, string];
export type BettererFileMarks = Array<BettererFileMark>;
export type BettererFileMarksMap = Record<string, BettererFileMarks>;
export type BettererFileHashMap = Record<string, string>;
