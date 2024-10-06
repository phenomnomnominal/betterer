import type { BettererLog, BettererLogs } from '@betterer/logger';

import type { BettererReporterAction } from './actions.js';
import type { BettererReporterState } from './types.js';

import { createContext, useContext, useReducer } from '@betterer/render';

import { CONTEXT_END, LOG, STATUS, SUITE_END, SUITE_START } from './actions.js';
import { BettererError, invariantΔ } from '@betterer/errors';

export const BettererReporterContext = createContext<BettererReporterState | null>(null);

export function useReporterState(): BettererReporterState {
  const context = useContext(BettererReporterContext);
  if (context === null) {
    throw new BettererError('Trying to use `BettererReporterContext` before it was created` 🔥');
  }
  return context;
}

export function useStore(
  initialState: BettererReporterState
): [BettererReporterState, React.Dispatch<BettererReporterAction>] {
  return useReducer((state: BettererReporterState, action: BettererReporterAction): BettererReporterState => {
    switch (action.name) {
      case CONTEXT_END: {
        return {
          ...state,
          contextSummary: action.contextSummary
        };
      }
      case LOG: {
        const { name } = action.run;
        const runLogs = state.logs[name];
        invariantΔ(runLogs, '`logs[run.name]` should have been initialised in the `suiteStart` action!');
        return {
          ...state,
          logs: { ...state.logs, [name]: [...runLogs, action.log] }
        };
      }
      case STATUS: {
        const { name } = action.run;
        return {
          ...state,
          status: { ...state.status, [name]: action.status }
        };
      }
      case SUITE_END: {
        return {
          ...state,
          suite: void 0,
          suiteSummary: action.suiteSummary
        };
      }
      case SUITE_START: {
        const runsLogs: Record<string, BettererLogs> = {};
        const runsStatus: Record<string, BettererLog> = {};
        action.suite.runs.forEach((run) => {
          runsLogs[run.name] = [];
          runsStatus[run.name] = {};
        });

        return {
          ...state,
          done: action.done,
          logs: { ...state.logs, ...runsLogs },
          status: { ...state.status, ...runsStatus },
          suite: action.suite,
          suiteSummary: void 0
        };
      }
    }
  }, initialState);
}
