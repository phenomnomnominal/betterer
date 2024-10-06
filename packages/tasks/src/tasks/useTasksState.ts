import { BettererError } from '@betterer/errors';
import { createContext, useContext, useReducer, useRef } from '@betterer/render';
import { getPreciseTimeΔ } from '@betterer/time';

export const BettererTasksContext = createContext<[BettererTasksState, BettererTasksAPI] | null>(null);

function useTasksContext(): [BettererTasksState, BettererTasksAPI] {
  const context = useContext(BettererTasksContext);
  if (context === null) {
    throw new BettererError('Trying to use `BettererTasksContext` before it was created` 🔥');
  }
  return context;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * The state of the a running tasks.
 */
export interface BettererTaskState {
  /**
   * If this task has finished running or not. It will be `true` if an error has been throw.
   */
  done: boolean;
  /**
   * If this task is currently running or not.
   */
  running: boolean;
  /**
   * The error thrown by this task. It will be `null` if the task completes successfully.
   */
  error: Error | null;
}

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
  /**
   * State for each individual running task.
   */
  taskState: Record<string, BettererTaskState>;
}

type BettererTasksAction =
  | {
      type: 'reset';
    }
  | {
      type: 'start';
      name: string;
    }
  | {
      type: 'stop';
      name: string;
    }
  | {
      type: 'error';
      name: string;
      error: Error;
    };

/** @knipignore used by an exported function */
export interface BettererTasksAPI {
  error(name: string, error: Error): void;
  start(name: string): void;
  stop(name: string): void;
}

export function useTasksState(): [BettererTasksState, BettererTasksAPI] {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const api = useRef<BettererTasksAPI>({
    error(name: string, error: Error) {
      dispatch({ type: 'error', error, name });
    },
    start(name: string) {
      dispatch({ type: 'start', name });
    },
    stop(name: string) {
      dispatch({ type: 'stop', name });
    }
  });

  return [state, api.current];
}

/** @knipignore used by an exported function */
export interface BettererTaskAPI {
  error(error: Error): void;
  start(): void;
  stop(): void;
}

export function useTaskState(name: string): [BettererTaskState | null, BettererTaskAPI] {
  const [tasksState, tasks] = useTasksContext();

  const api = useRef<BettererTaskAPI>({
    error(error: Error) {
      tasks.error(name, error);
    },
    start() {
      tasks.start(name);
    },
    stop() {
      tasks.stop(name);
    }
  });

  return [tasksState.taskState[name] ?? null, api.current];
}

function getInitialState(): BettererTasksState {
  return {
    running: 0,
    done: 0,
    errors: 0,
    startTime: getPreciseTimeΔ(),
    endTime: null,
    taskState: {}
  };
}

function reducer(state: BettererTasksState, action: BettererTasksAction): BettererTasksState {
  switch (action.type) {
    case 'start': {
      if (state.endTime) {
        state = getInitialState();
      }
      return {
        ...state,
        running: state.running + 1,
        taskState: { ...state.taskState, [action.name]: { running: true, done: false, error: null } }
      };
    }
    case 'stop': {
      return setEndTime({
        ...state,
        running: state.running - 1,
        done: state.done + 1,
        taskState: { ...state.taskState, [action.name]: { running: false, done: true, error: null } }
      });
    }
    case 'error': {
      return setEndTime({
        ...state,
        running: state.running - 1,
        done: state.done + 1,
        errors: state.errors + 1,
        taskState: { ...state.taskState, [action.name]: { running: false, done: true, error: action.error } }
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
