import { ForegroundColor } from 'chalk';

import { BettererLogger, BettererLoggerAsync } from '../../types';

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export type BettererTaskError = Error & {
  details: string;
  message: string;
};

export type BettererTaskStatusUpdate = (status: string) => void;
export type BettererTaskStatusUpdateAsync = (status: string) => Promise<void>;

export type BettererTaskContext = {
  name: string;
  run: (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
};

export type BettererTaskLogger = BettererLogger & {
  progress: BettererTaskStatusUpdate;
};
export type BettererTaskLoggerAsync = BettererLoggerAsync & {
  progress: BettererTaskStatusUpdateAsync;
};
