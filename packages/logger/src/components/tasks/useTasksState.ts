import { createContext, useCallback, useReducer } from 'react';
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

export function useTasksState(ref: unknown): [BettererTasksState, BettererTasksStateAPI] {
  const previous = getState(ref);
  const reducer = useCallback(setState(ref), []);
  const [state, dispatch] = useReducer(reducer, previous);

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

type BettererTasksReducer = (state: BettererTasksState, action: BettererTasksAction) => BettererTasksState;

const TASKS_STATE_CACHE = new Map<unknown, BettererTasksState>();

function getInitialState(): BettererTasksState {
  return {
    running: 0,
    done: 0,
    errors: 0,
    startTime: performance.now(),
    shouldExit: false
  };
}

function getState(ref?: unknown): BettererTasksState {
  if (ref && TASKS_STATE_CACHE.has(ref)) {
    return TASKS_STATE_CACHE.get(ref) as BettererTasksState;
  }
  const state = getInitialState();
  if (ref) {
    TASKS_STATE_CACHE.set(ref, state);
  }
  return state;
}

function setState(ref: unknown): BettererTasksReducer {
  return (state: BettererTasksState, action: BettererTasksAction): BettererTasksState => {
    const newState = reducer(state, action);
    TASKS_STATE_CACHE.set(ref, newState);
    return newState;
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
