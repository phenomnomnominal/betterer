import type {
  BettererContextSummary,
  BettererRun,
  BettererRunSummary,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import type { BettererError } from '@betterer/errors';

export const CONTEXT_END = 'contextEnd';
export const RUN_END = 'runEnd';
export const RUN_ERROR = 'runError';
export const RUN_START = 'runStart';
export const SUITE_END = 'suiteEnd';
export const SUITE_START = 'suiteStart';

/** @knipignore used by an exported function */
export interface BettererContextEndAction {
  name: typeof CONTEXT_END;
  contextSummary: BettererContextSummary;
}

/** @knipignore used by an exported function */
export interface BettererRunEndAction {
  name: typeof RUN_END;
  runSummary: BettererRunSummary;
}

/** @knipignore used by an exported function */
export interface BettererRunErrorAction {
  name: typeof RUN_ERROR;
  run: BettererRun;
  error: BettererError;
}

/** @knipignore used by an exported function */
export interface BettererRunStartAction {
  name: typeof RUN_START;
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
}

export type BettererReporterAction =
  | BettererContextEndAction
  | BettererRunEndAction
  | BettererRunErrorAction
  | BettererRunStartAction
  | BettererSuiteEndAction
  | BettererSuiteStartAction;

export function contextEnd(contextSummary: BettererContextSummary): BettererContextEndAction {
  return { name: CONTEXT_END, contextSummary };
}

export function runEnd(runSummary: BettererRunSummary): BettererRunEndAction {
  return { name: RUN_END, runSummary };
}

export function runError(run: BettererRun, error: BettererError): BettererRunErrorAction {
  return { name: RUN_ERROR, run, error };
}

export function runStart(run: BettererRun): BettererRunStartAction {
  return { name: RUN_START, run };
}

export function suiteStart(suite: BettererSuite): BettererSuiteStartAction {
  return { name: SUITE_START, suite };
}

export function suiteEnd(suiteSummary: BettererSuiteSummary): BettererSuiteEndAction {
  return { name: SUITE_END, suiteSummary };
}
