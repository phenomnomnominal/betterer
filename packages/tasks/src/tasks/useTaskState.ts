import { useContext, useReducer, useRef } from 'react';

import { BettererTasksAction, BettererTasksStateContext, BettererTasksStateAPI } from './useTasksState';
import { BettererTaskLog, BettererTaskLogs } from './types';

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
      type: 'reset';
    }
  | {
      type: 'status';
      data: BettererTaskLog;
    }
  | {
      type: 'log';
      data: BettererTaskLog;
    };

type BettererTaskStateAPI = BettererTasksStateAPI & {
  reset(): void;
  status(status: BettererTaskLog): Promise<void>;
  log(status: BettererTaskLog): Promise<void>;
};

export function useTaskState(): [BettererTaskState, BettererTaskStateAPI] {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const tasks = useContext(BettererTasksStateContext);
  const api = useRef<BettererTaskStateAPI>({
    reset() {
      dispatch({ type: 'reset' });
    },
    start() {
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
  });

  return [state, api.current];
}

function reducer(state: BettererTaskState, action: BettererTaskAction): BettererTaskState {
  switch (action.type) {
    case 'reset': {
      return {
        ...INITIAL_STATE
      };
    }
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
