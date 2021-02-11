import { useCallback, useContext, useReducer } from 'react';

import { BettererTasksAction, BettererTasksContext, BettererTasksStateAPI } from './useTasksState';
import { BettererTaskContext, BettererTaskLog, BettererTaskLogs } from './types';

type BettererTaskState = {
  done: boolean;
  running: boolean;
  status: BettererTaskLog | null;
  messageLogs: BettererTaskLogs;
  error: Error | null;
};

const INITIAL_STATE: BettererTaskState = {
  done: false,
  running: false,
  status: null,
  messageLogs: [],
  error: null
};

type BettererTaskAction =
  | BettererTasksAction
  | {
      type: 'status';
      data: BettererTaskLog;
    }
  | {
      type: 'log';
      data: BettererTaskLog;
    };

type BettererTaskStateAPI = BettererTasksStateAPI & {
  status(status: BettererTaskLog): Promise<void>;
  log(status: BettererTaskLog): Promise<void>;
};

export function useTasksState(context: BettererTaskContext): [BettererTaskState, BettererTaskStateAPI] {
  const previous = getState(context);
  const reducer = useCallback(setState(context), []);
  const [state, dispatch] = useReducer(reducer, previous);
  const tasks = useContext(BettererTasksContext);

  const api: BettererTaskStateAPI = {
    start() {
      tasks.start();
      dispatch({ type: 'start' });
    },
    status(status: BettererTaskLog) {
      return Promise.resolve(dispatch({ type: 'status', data: status }));
    },
    log(log: BettererTaskLog) {
      return Promise.resolve(dispatch({ type: 'log', data: log }));
    },
    stop() {
      tasks.stop();
      dispatch({ type: 'stop' });
    },
    error(error: Error) {
      tasks.error(error);
      dispatch({ type: 'error', data: error });
    }
  };

  return [state, api];
}

export function useCachedTask(context: BettererTaskContext): () => void {
  const tasks = useContext(BettererTasksContext);
  return () => {
    const cached = getState(context);
    tasks.start();
    if (cached.error) {
      tasks.error(cached.error);
    }
    tasks.stop();
  };
}

type BettererTaskReducer = (state: BettererTaskState, action: BettererTaskAction) => BettererTaskState;

const TASK_STATE_CACHE = new Map<BettererTaskContext, BettererTaskState>();

function getState(context: BettererTaskContext): BettererTaskState {
  if (TASK_STATE_CACHE.has(context)) {
    return TASK_STATE_CACHE.get(context) as BettererTaskState;
  }
  const state = INITIAL_STATE;
  TASK_STATE_CACHE.set(context, state);
  return state;
}

function setState(context: BettererTaskContext): BettererTaskReducer {
  return (state: BettererTaskState, action: BettererTaskAction): BettererTaskState => {
    const newState = reducer(state, action);
    TASK_STATE_CACHE.set(context, newState);
    return newState;
  };
}

function reducer(state: BettererTaskState, action: BettererTaskAction): BettererTaskState {
  switch (action.type) {
    case 'status':
      return {
        ...state,
        running: true,
        status: action.data
      };
    case 'log': {
      return {
        ...state,
        messageLogs: [...state.messageLogs, action.data]
      };
    }
    case 'stop': {
      return {
        ...state,
        running: false,
        done: true
      };
    }
    case 'error': {
      return {
        ...state,
        error: action.data,
        running: false,
        done: true
      };
    }
    default:
      return state;
  }
}
