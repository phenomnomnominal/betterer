import { BettererContext } from '@betterer/betterer';

import { BettererReporterAction, CONTEXT_END, RUNS_END, RUNS_START } from './actions';
import { BettererReporterDispatch, BettererReporterState } from './types';

export function createStore(context: BettererContext): BettererReporterDispatch {
  const reducer = (state: BettererReporterState, action: BettererReporterAction): BettererReporterState => {
    switch (action.name) {
      case CONTEXT_END: {
        return {
          ...state,
          suiteSummaries: action.suiteSummaries
        };
      }
      case RUNS_START: {
        return {
          context: state.context,
          filePaths: action.filePaths,
          runs: action.runs
        };
      }
      case RUNS_END: {
        return {
          context: state.context,
          filePaths: state.filePaths,
          runSummaries: action.runSummaries,
          suiteSummary: action.suiteSummary
        };
      }
    }
  };

  let state: BettererReporterState = { context };
  return function dispatch(action?: BettererReporterAction): BettererReporterState {
    if (!action) {
      return state;
    }
    state = reducer(state, action);
    return state;
  };
}
