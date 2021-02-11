import { Box, useApp } from 'ink';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { performance } from 'perf_hooks';

import { BettererTaskStatus } from './status';
import { useTasksState, BettererTasksContext, BettererTasksState } from './useTasksState';
import { BettererTaskLog } from './types';

export type BettererTasksProps = {
  name: string;
  statusMessage: (state: BettererTasksState) => string;
  exit?: boolean;
};

export const BettererTasks: FC<BettererTasksProps> = memo(function BettererTasks({
  children,
  exit = true,
  name,
  statusMessage
}) {
  const app = useApp();
  const formatter = Intl.NumberFormat();

  const [state, api] = useTasksState();
  const [time, setTime] = useState(0);

  const { errors, shouldExit } = state;

  const updateTime = useCallback(() => {
    setTime(Math.floor(performance.now() - state.startTime));
  }, [state.startTime]);

  useEffect(() => {
    if (shouldExit) {
      return;
    }
    const timer = setInterval(updateTime, getTimerInterval());
    updateTime();
    return () => clearInterval(timer);
  }, [shouldExit]);

  const result = `${statusMessage(state)}`;
  let status: BettererTaskLog = ['🌟', 'whiteBright', result];
  if (errors > 0) {
    status = ['💥', 'redBright', result];
  } else if (shouldExit) {
    status = ['🎉', 'greenBright', result];
    if (exit) {
      setImmediate(() => app.exit());
    }
  }

  return (
    <BettererTasksContext.Provider value={api}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name} (${formatter.format(time)}ms)`} status={status} />
        {children}
      </Box>
    </BettererTasksContext.Provider>
  );
});

const DEFAULT_TASK_TIME_INTERVAL = 10;
function getTimerInterval(): number {
  const { BETTERER_TASK_TIMER_INTERVAL } = process.env;
  return BETTERER_TASK_TIMER_INTERVAL ? parseInt(BETTERER_TASK_TIMER_INTERVAL, 10) : DEFAULT_TASK_TIME_INTERVAL;
}
