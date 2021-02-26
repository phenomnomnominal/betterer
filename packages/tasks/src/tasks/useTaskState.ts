import { useCallback, useContext, useReducer } from 'react';

import { BettererTasksAction, BettererTasksStateContext, BettererTasksStateAPI } from './useTasksState';
import { BettererTaskLog, BettererTaskLogs, BettererTask } from './types';

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

export function useTaskState(task: BettererTask): [BettererTaskState, BettererTaskStateAPI] {
  const previous = getState(task);
  const reducer = useCallback(setState(task), []);
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

const TASK_STATE_CACHE = new Map<BettererTask, BettererTaskState>();

function getState(task: BettererTask): BettererTaskState {
  if (!TASK_STATE_CACHE.has(task)) {
    TASK_STATE_CACHE.set(task, INITIAL_STATE);
  }
  return TASK_STATE_CACHE.get(task) as BettererTaskState;
}

function setState(task: BettererTask): BettererTaskReducer {
  return (state: BettererTaskState, action: BettererTaskAction): BettererTaskState => {
    const newState = reducer(state, action);
    TASK_STATE_CACHE.set(task, newState);
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
