import { BettererLogger } from '@betterer/logger';
import { ForegroundColor } from 'chalk';

import { BettererTasksState } from './useTasksState';

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskRun = (logger: BettererLogger) => Promise<BettererTaskLog | string | void>;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = Array<BettererTaskLog>;

export type BettererTasksDone = () => void;

export type BettererTasksStatusUpdate = (state: BettererTasksState) => string;
