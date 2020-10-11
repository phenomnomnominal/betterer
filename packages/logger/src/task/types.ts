import { ForegroundColor } from 'chalk';

export type BettererLoggerTaskColour = typeof ForegroundColor;

export type BettererLoggerTaskStatus = [indicator: string, colour: BettererLoggerTaskColour, message: string];
export type BettererLoggerTaskStatusMessages = ReadonlyArray<BettererLoggerTaskStatus>;

export type BettererLoggerTaskError = Error & {
  details: string;
  message: string;
};

export type BettererLoggerTaskUpdate = (status: string) => void;

export type BettererLoggerTaskContext = {
  name: string;
  run: (logger: BettererTaskLogger) => Promise<BettererLoggerTaskStatus | string | void>;
};

export type BettererTaskLogger = {
  status: BettererLoggerTaskUpdate;
  debug: BettererLoggerTaskUpdate;
  info: BettererLoggerTaskUpdate;
  warn: BettererLoggerTaskUpdate;
};
