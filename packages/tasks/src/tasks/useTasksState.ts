import { BettererError } from '@betterer/errors';
import { createContext, useContext, useReducer, useRef } from '@betterer/render';

import { getPreciseTimeΔ } from '@betterer/time';

/**
 * @internal This could change at any point! Please don't use!
 *
 * The state of the running tasks. `endTime` will only be present when there are no more
 * `running` tasks.
 */
export interface BettererTasksState {
  /**
   * How many tasks are currently running.
   */
  running: number;
  /**
   * How many tasks are done running.
   */
  done: number;
  /**
   * How many tasks threw an error.
   */
  errors: number;
  /**
   * What time the tasks started running.
   */
  startTime: number;
  /**
   * What time the tasks finished running.
   *
   * @remarks will be `null` until `running` is `0`.
   */
  endTime: number | null;
}

type BettererTasksAction =
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

/** @knipignore used by an exported function */
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
    startTime: getPreciseTimeΔ(),
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
  return { ...state, endTime: getPreciseTimeΔ() };
}
