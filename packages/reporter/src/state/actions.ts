import type { BettererContextSummary, BettererRun, BettererSuite, BettererSuiteSummary } from '@betterer/betterer';
import type { BettererLog } from '@betterer/logger';
import type { BettererTasksDone } from '@betterer/tasks';

export const CONTEXT_END = 'contextEnd';
export const LOG = 'log';
export const STATUS = 'status';
export const SUITE_END = 'suiteEnd';
export const SUITE_START = 'suiteStart';

/** @knipignore used by an exported function */
export interface BettererContextEndAction {
  name: typeof CONTEXT_END;
  contextSummary: BettererContextSummary;
}

/** @knipignore used by an exported function */
export interface BettererLogAction {
  name: typeof LOG;
  log: BettererLog;
  run: BettererRun;
}

/** @knipignore used by an exported function */
export interface BettererStatusAction {
  name: typeof STATUS;
  status: BettererLog;
  run: BettererRun;
}

/** @knipignore used by an exported function */
export interface BettererSuiteEndAction {
  name: typeof SUITE_END;
  suiteSummary: BettererSuiteSummary;
}

/** @knipignore used by an exported function */
export interface BettererSuiteStartAction {
  name: typeof SUITE_START;
  suite: BettererSuite;
  done: BettererTasksDone;
}

export type BettererReporterAction =
  | BettererContextEndAction
  | BettererLogAction
  | BettererStatusAction
  | BettererSuiteEndAction
  | BettererSuiteStartAction;

export function contextEnd(contextSummary: BettererContextSummary): BettererContextEndAction {
  return { name: CONTEXT_END, contextSummary };
}

export function suiteStart(suite: BettererSuite, done: BettererTasksDone): BettererSuiteStartAction {
  return { name: SUITE_START, suite, done };
}

export function suiteEnd(suiteSummary: BettererSuiteSummary): BettererSuiteEndAction {
  return { name: SUITE_END, suiteSummary };
}

export function log(run: BettererRun, log: BettererLog): BettererLogAction {
  return { name: LOG, log, run };
}

export function status(run: BettererRun, status: BettererLog): BettererStatusAction {
  return { name: STATUS, status, run };
}
