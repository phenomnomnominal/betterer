import { useCallback, useContext, useReducer } from 'react';

import { BettererTasksAction, BettererTasksStateContext, BettererTasksStateAPI } from './useTasksState';
import { BettererTaskRunner, BettererTaskLog, BettererTaskLogs } from './types';

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

export function useTaskState(runner: BettererTaskRunner): [BettererTaskState, BettererTaskStateAPI] {
  const previous = getState(runner);
  const reducer = useCallback(setState(runner), []);
  const [state, dispatch] = useReducer(reducer, previous);
  const tasks = useContext(BettererTasksStateContext);

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

const TASK_STATE_CACHE = new Map<BettererTaskRunner, BettererTaskState>();

function getState(runner: BettererTaskRunner): BettererTaskState {
  if (!TASK_STATE_CACHE.has(runner)) {
    TASK_STATE_CACHE.set(runner, INITIAL_STATE);
  }
  return TASK_STATE_CACHE.get(runner) as BettererTaskState;
}

function setState(runner: BettererTaskRunner): BettererTaskReducer {
  return (state: BettererTaskState, action: BettererTaskAction): BettererTaskState => {
    const newState = reducer(state, action);
    TASK_STATE_CACHE.set(runner, newState);
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
    default: {
      return state;
    }
  }
}
