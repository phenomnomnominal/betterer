import { createContext, Dispatch } from 'react';

export type BettererTasksState = {
  running: number;
  done: number;
  errors: number;
  startTime: number;
  shouldExit: boolean;
};

export type BettererTasksAction =
  | {
      type: 'start';
    }
  | {
      type: 'stop';
    }
  | {
      type: 'error';
    };

export type BettererTasksContextType = Dispatch<BettererTasksAction>;

export const INITIAL_STATE: BettererTasksState = {
  running: 0,
  done: 0,
  errors: 0,
  startTime: Date.now(),
  shouldExit: false
};

export const BettererTasksContext = createContext<BettererTasksContextType>(() => void 0);

export function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        running: state.running + 1
      };
    case 'stop': {
      const newState = {
        ...state,
        running: state.running - 1,
        done: state.done + 1
      };
      return getShouldExit(newState);
    }
    case 'error': {
      const newState = {
        ...state,
        running: state.running - 1,
        done: state.done + 1,
        errors: state.errors + 1
      };
      return getShouldExit(newState);
    }
    default:
      return state;
  }
}

function getShouldExit(state: BettererTasksState): BettererTasksState {
  const shouldExit = state.running === 0;
  return { ...state, shouldExit };
}
