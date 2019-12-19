import { LoggerCodeInfo } from '@betterer/logger';

export type BettererFileInfo = LoggerCodeInfo;
export type BettererFileInfoMap = Record<string, Array<BettererFileInfo>>;
export type BettererFileMark = [number, number, number, string];
export type BettererFileMarks = Array<BettererFileMark>;
export type BettererFileMarksMap = Record<string, BettererFileMarks>;
export type BettererFileHashMap = Record<string, string>;
