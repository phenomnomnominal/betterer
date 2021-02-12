import { ForegroundColor } from 'chalk';

import { BettererLogger } from '../../types';
import { BettererTasksState } from './useTasksState';

export type BettererTasksStatusMessage = (state: BettererTasksState) => string;

export type BettererTaskLogger = BettererLogger & {
  progress: BettererTaskStatusUpdate;
};

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export type BettererTaskStatusUpdate = (status: string) => Promise<void>;

export type BettererTaskRunner = (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
