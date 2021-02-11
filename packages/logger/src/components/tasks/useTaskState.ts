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
      dispatch({ type: 'start' });
      tasks.start();
    },
    status(status: BettererTaskLog) {
      return Promise.resolve(dispatch({ type: 'status', data: status }));
    },
    log(log: BettererTaskLog) {
      return Promise.resolve(dispatch({ type: 'log', data: log }));
    },
    stop() {
      dispatch({ type: 'stop' });
      tasks.stop();
    },
    error(error: Error) {
      dispatch({ type: 'error', data: error });
      tasks.error(error);
    }
  };

  return [state, api];
}

type BettererTaskReducer = (state: BettererTaskState, action: BettererTaskAction) => BettererTaskState;

const TASK_STATE_CACHE = new WeakMap<BettererTaskContext, BettererTaskState>();

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
