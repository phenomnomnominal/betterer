import { ForegroundColor } from 'chalk';

import { BettererLogger } from '../../types';

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export type BettererTaskStatusUpdate = (status: string) => Promise<void>;

export type BettererTaskContext = {
  name: string;
  run: (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
};

export type BettererTaskLogger = BettererLogger & {
  progress: BettererTaskStatusUpdate;
};
