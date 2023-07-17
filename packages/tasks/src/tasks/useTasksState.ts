import { BettererError } from '@betterer/errors';
import { createContext, useContext, useReducer, useRef } from '@betterer/render';

import { getPreciseTime } from '../utils.js';

/**
 * @public The state of the running tasks. `endTime` will only be present when there are no more
 * `running` tasks.
 */
export interface BettererTasksState {
  running: number;
  done: number;
  errors: number;
  startTime: number;
  endTime: number | null;
}

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

export interface BettererTasksAPI {
  error(error: Error): void;
  start(): void;
  stop(): void;
}

export function useTasksState(): [BettererTasksState, BettererTasksAPI] {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const api = useRef<BettererTasksAPI>({
    error(error: Error) {
      dispatch({ type: 'error', data: error });
    },
    start() {
      dispatch({ type: 'start' });
    },
    stop() {
      dispatch({ type: 'stop' });
    }
  });

  return [state, api.current];
}

function getInitialState(): BettererTasksState {
  return {
    running: 0,
    done: 0,
    errors: 0,
    startTime: getPreciseTime(),
    endTime: null
  };
}

export const BettererTasksContext = createContext<[BettererTasksState, BettererTasksAPI] | null>(null);

export function useTasks(): [BettererTasksState, BettererTasksAPI] {
  const context = useContext(BettererTasksContext);
  if (context === null) {
    throw new BettererError('Trying to use `BettererTasksContext` before it was created` 🔥');
  }
  return context;
}

function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start': {
      if (state.endTime != null) {
        return { ...getInitialState(), running: state.running + 1 };
      }
      return {
        ...state,
        running: state.running + 1
      };
    }
    case 'stop': {
      return setEndTime({
        ...state,
        running: state.running - 1,
        done: state.done + 1
      });
    }
    case 'error': {
      return setEndTime({
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

function setEndTime(state: BettererTasksState): BettererTasksState {
  const shouldExit = state.running === 0;
  if (!shouldExit) {
    return state;
  }
  return { ...state, endTime: getPreciseTime() };
}
