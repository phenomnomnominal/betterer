import * as logUpdate from 'log-update';

export type BettererLoggerMessages = ReadonlyArray<string>;
export type BettererLogger = (...messages: BettererLoggerMessages) => void;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  start: number;
  end: number;
};

export type BettererLoggerOverwriteDone = typeof logUpdate['done'];
