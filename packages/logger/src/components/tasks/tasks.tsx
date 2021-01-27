import { Box, useApp } from 'ink';
import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';

import { INITIAL_STATE, reducer, BettererTasksContext, BettererTasksState } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskLog } from './types';

export type BettererTasksProps = {
  name: string;
  statusMessage: (state: BettererTasksState) => string;
};

export const BettererTasks: FC<BettererTasksProps> = function BettererTask({ children, name, statusMessage }) {
  const app = useApp();
  const formatter = Intl.NumberFormat();

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [time, setTime] = useState(0);

  const updateTime = useCallback(() => {
    setTime(Date.now() - state.startTime);
  }, [state.startTime]);

  useEffect(() => {
    if (state.shouldExit) {
      return;
    }
    const timer = setInterval(updateTime, getTimerInterval());
    updateTime();
    return () => clearInterval(timer);
  }, [state.shouldExit]);

  const { errors, running, shouldExit } = state;
  const result = `${statusMessage(state)}`;
  let status: BettererTaskLog = ['🌟', 'whiteBright', result];
  if (errors > 0) {
    status = ['💥', 'redBright', result];
  } else if (running === 0 && shouldExit) {
    status = ['🎉', 'greenBright', result];
    setImmediate(app.exit);
  }

  return (
    <BettererTasksContext.Provider value={dispatch}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name} (${formatter.format(time)}ms)`} status={status} />
        {children}
      </Box>
    </BettererTasksContext.Provider>
  );
};

const DEFAULT_TASK_TIME_INTERVAL = 10;
function getTimerInterval(): number {
  const { BETTERER_TASK_TIMER_INTERVAL } = process.env;
  return BETTERER_TASK_TIMER_INTERVAL ? parseInt(BETTERER_TASK_TIMER_INTERVAL, 10) : DEFAULT_TASK_TIME_INTERVAL;
}
