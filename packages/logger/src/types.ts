import logUpdate from 'log-update';
import { DiffOptions } from 'jest-diff';

export type BettererLoggerMessages = ReadonlyArray<string>;
export type BettererLogger = (...messages: BettererLoggerMessages) => void;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};

export type BettererLoggerOverwriteDone = typeof logUpdate['done'];

export type BettererLoggerDiffOptions = DiffOptions;
