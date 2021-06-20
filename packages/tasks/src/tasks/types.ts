import { BettererLogger } from '@betterer/logger';
import { ForegroundColor } from 'chalk';

import { BettererTasksState } from './useTasksState';

export type BettererTasksStatusUpdate = (state: BettererTasksState) => string;

export type BettererTaskRun = (logger: BettererLogger) => Promise<BettererTaskLog | string | void>;

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;
