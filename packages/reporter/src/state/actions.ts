import {
  BettererFilePaths,
  BettererRuns,
  BettererRunSummaries,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';

export const CONTEXT_END = 'contextEnd';
export const RUNS_START = 'runsStart';
export const RUNS_END = 'runsEnd';

export type BettererContextEndAction = {
  name: typeof CONTEXT_END;
  suiteSummaries: BettererSummaries;
};

export type BettererRunsStartAction = {
  name: typeof RUNS_START;
  filePaths: BettererFilePaths;
  runs: BettererRuns;
};

export type BettererRunsEndAction = {
  name: typeof RUNS_END;
  runSummaries: BettererRunSummaries;
  suiteSummary: BettererSummary;
};

export type BettererReporterAction = BettererContextEndAction | BettererRunsStartAction | BettererRunsEndAction;

export function contextEnd(suiteSummaries: BettererSummaries): BettererContextEndAction {
  return {
    name: CONTEXT_END,
    suiteSummaries
  };
}

export function runsStart(filePaths: BettererFilePaths, runs: BettererRuns): BettererRunsStartAction {
  return {
    name: RUNS_START,
    filePaths,
    runs
  };
}

export function runsEnd(runSummaries: BettererRunSummaries, suiteSummary: BettererSummary): BettererRunsEndAction {
  return {
    name: RUNS_END,
    runSummaries,
    suiteSummary
  };
}
