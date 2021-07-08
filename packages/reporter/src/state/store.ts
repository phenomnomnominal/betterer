import { BettererContext } from '@betterer/betterer';

import { BettererReporterAction, CONTEXT_END, SUITE_END, SUITE_START } from './actions';
import { BettererReporterDispatch, BettererReporterState } from './types';

export function createStore(context: BettererContext): BettererReporterDispatch {
  const reducer = (state: BettererReporterState, action: BettererReporterAction): BettererReporterState => {
    switch (action.name) {
      case CONTEXT_END: {
        return {
          ...state,
          contextSummary: action.contextSummary
        };
      }
      case SUITE_START: {
        return {
          context: state.context,
          suite: action.suite
        };
      }
      case SUITE_END: {
        return {
          context: state.context,
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
