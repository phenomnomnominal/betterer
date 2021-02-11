import { createContext, useReducer } from 'react';
import { performance } from 'perf_hooks';

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
      data: Error;
    };

export type BettererTasksStateAPI = {
  start(): void;
  stop(): void;
  error(error: Error): void;
};

const INITIAL_STATE: BettererTasksState = {
  running: 0,
  done: 0,
  errors: 0,
  startTime: performance.now(),
  shouldExit: false
};

export function useTasksState(): [BettererTasksState, BettererTasksStateAPI] {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const api: BettererTasksStateAPI = {
    start() {
      dispatch({ type: 'start' });
    },
    stop() {
      dispatch({ type: 'stop' });
    },
    error(error: Error) {
      dispatch({ type: 'error', data: error });
    }
  };

  return [state, api];
}

export const BettererTasksContext = createContext<BettererTasksStateAPI>({
  start() {
    throw new Error();
  },
  stop() {
    throw new Error();
  },
  error() {
    throw new Error();
  }
});

function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        running: state.running + 1
      };
    case 'stop': {
      return getShouldExit({
        ...state,
        running: state.running - 1,
        done: state.done + 1
      });
    }
    case 'error': {
      return getShouldExit({
        ...state,
        running: state.running - 1,
        done: state.done + 1,
        errors: state.errors + 1
      });
    }
    default:
      return state;
  }
}

function getShouldExit(state: BettererTasksState): BettererTasksState {
  const shouldExit = state.running === 0;
  return { ...state, shouldExit };
}
