import { createContext, Dispatch } from 'react';

export type BettererTasksState = {
  running: number;
  done: number;
  error: number;
};

export type BettererTasksAction = {
  type: 'start' | 'stop' | 'error';
};

export type BettererTasksContextType = Dispatch<BettererTasksAction>;

export const INITIAL_STATE: BettererTasksState = {
  running: 0,
  done: 0,
  error: 0
};

export const BettererTasksContext = createContext<BettererTasksContextType>(() => void 0);

export function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start':
      return { ...state, running: state.running + 1 };
    case 'stop':
      return { ...state, running: state.running - 1, done: state.done + 1 };
    case 'error':
      return { ...state, running: state.running - 1, error: state.error + 1 };
    default:
      return state;
  }
}
