import type { BettererLogger } from '@betterer/logger';
import type { ForegroundColorName } from 'chalk';

import type { BettererTasksState } from './useTasksState.js';

/** @knipignore used by an exported function */
export type BettererTaskColour = ForegroundColorName;

/**
 * @internal This could change at any point! Please don't use!
 *
 * An asynchronous task that will be orchestrated by the {@link @betterer/tasks#BettererTasksLogger | `BettererTasksLogger`}.
 *
 * @param logger - Parameter provides access to asynchronous logging which will be shown to the
 * user once the task is complete.
 *
 * @returns If the task returns it is a "success".
 *
 * @throws If the task throws it is a "failure".
 */
export type BettererTask = (logger: BettererLogger) => Promise<string | void>;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = Array<BettererTaskLog>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * A function that is called whenever a set of tasks are completed.
 */
export type BettererTasksDone = () => void;

/**
 * @internal This could change at any point! Please don't use!
 *
 * A function that can be used to customise the output of the task status summary.
 *
 * @remarks Useful for custom pluralisation and internationalisation.
 */
export type BettererTasksStatusUpdate = (state: BettererTasksState) => string;
