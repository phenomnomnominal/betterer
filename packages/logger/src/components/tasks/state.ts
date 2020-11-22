import { createContext, Dispatch } from 'react';

export type BettererTasksState = {
  running: number;
  done: number;
  errors: number;
  error: Error | null;
};

export type BettererTasksAction =
  | {
      type: 'start';
    }
  | {
      type: 'stop';
    }
  | { type: 'error'; error: Error };

export type BettererTasksContextType = Dispatch<BettererTasksAction>;

export const INITIAL_STATE: BettererTasksState = {
  running: 0,
  done: 0,
  errors: 0,
  error: null
};

export const BettererTasksContext = createContext<BettererTasksContextType>(() => void 0);

export function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start':
      return { ...state, running: state.running + 1 };
    case 'stop':
      return { ...state, running: state.running - 1, done: state.done + 1 };
    case 'error':
      return { ...state, running: state.running - 1, errors: state.errors + 1, error: action.error };
    default:
      return state;
  }
}
