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
  error(error: Error): void;
  start(): void;
  stop(): void;
};

export function useTasksState(): [BettererTasksState, BettererTasksStateAPI] {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const api: BettererTasksStateAPI = {
    error(error: Error) {
      dispatch({ type: 'error', data: error });
    },
    start() {
      dispatch({ type: 'start' });
    },
    stop() {
      dispatch({ type: 'stop' });
    }
  };

  return [state, api];
}
function getInitialState(): BettererTasksState {
  return {
    running: 0,
    done: 0,
    errors: 0,
    startTime: performance.now(),
    shouldExit: false
  };
}

export const BettererTasksStateContext = createContext<BettererTasksStateAPI>({
  error() {
    throw new Error();
  },
  start() {
    throw new Error();
  },
  stop() {
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
    default: {
      return state;
    }
  }
}

function getShouldExit(state: BettererTasksState): BettererTasksState {
  const shouldExit = state.running === 0;
  return { ...state, shouldExit };
}
