import { BettererSuiteSummary, BettererContextSummary } from '@betterer/betterer';
import { BettererSuite } from '@betterer/betterer/src/suite';

export const CONTEXT_END = 'contextEnd';
export const SUITE_START = 'suiteStart';
export const SUITE_END = 'suiteEnd';

export type BettererContextEndAction = {
  name: typeof CONTEXT_END;
  contextSummary: BettererContextSummary;
};

export type BettererSuiteStartAction = {
  name: typeof SUITE_START;
  suite: BettererSuite;
};

export type BettererSuiteEndAction = {
  name: typeof SUITE_END;
  suiteSummary: BettererSuiteSummary;
};

export type BettererReporterAction = BettererContextEndAction | BettererSuiteStartAction | BettererSuiteEndAction;

export function contextEnd(contextSummary: BettererContextSummary): BettererContextEndAction {
  return {
    name: CONTEXT_END,
    contextSummary
  };
}

export function suiteStart(suite: BettererSuite): BettererSuiteStartAction {
  return {
    name: SUITE_START,
    suite
  };
}

export function suiteEnd(suiteSummary: BettererSuiteSummary): BettererSuiteEndAction {
  return {
    name: SUITE_END,
    suiteSummary
  };
}
