import type { BettererTaskLog, BettererTaskLogs } from './types.js';

import { useReducer, useRef } from '@betterer/render';

import { useTasks } from './useTasksState.js';

interface BettererTaskState {
  done: boolean;
  running: boolean;
  status: BettererTaskLog | null;
  logs: BettererTaskLogs;
  error: Error | null;
}

const INITIAL_STATE: BettererTaskState = {
  done: false,
  running: false,
  status: null,
  logs: [],
  error: null
};

type BettererTaskAction =
  | {
      type: 'start';
    }
  | {
      type: 'stop';
    }
  | {
      type: 'error';
      data: Error;
    }
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

interface BettererTaskStateAPI {
  error(error: Error): void;
  start(): void;
  stop(): void;
  reset(): void;
  status(status: BettererTaskLog): Promise<void>;
  log(status: BettererTaskLog): Promise<void>;
}

export function useTaskState(): [BettererTaskState, BettererTaskStateAPI] {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [, tasks] = useTasks();
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
        logs: [...state.logs, action.data]
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
