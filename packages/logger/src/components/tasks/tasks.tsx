import { Box, useApp } from 'ink';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { performance } from 'perf_hooks';

import { BettererTaskStatus } from './status';
import { useTasksState, BettererTasksStateContext } from './useTasksState';
import { BettererTaskLog, BettererTasksStatusMessage } from './types';

const DEFAULT_TASK_TIME_INTERVAL = 10;

export type BettererTasksProps = {
  exit?: boolean;
  name: string;
  statusMessage: BettererTasksStatusMessage;
  ref?: unknown;
};

export const BettererTasks: FC<BettererTasksProps> = memo(function BettererTasks(props) {
  const { children, exit = true, name, statusMessage, ref } = props;
  const app = useApp();
  const formatter = Intl.NumberFormat();

  const [state, api] = useTasksState(ref);

  const [time, setTime] = useState(0);

  const { errors, running, shouldExit, startTime } = state;

  const updateTime = useCallback(() => {
    if (running) {
      setTime(performance.now());
    }
  }, []);

  useEffect(() => {
    if (shouldExit) {
      return;
    }
    const timer = setInterval(updateTime, DEFAULT_TASK_TIME_INTERVAL);
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

  const tasksTime = getTime(startTime, time);

  return (
    <BettererTasksStateContext.Provider value={api}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name} (${formatter.format(tasksTime)}ms)`} status={status} />
        {children}
      </Box>
    </BettererTasksStateContext.Provider>
  );
});

function getTime(startTime: number, time: number) {
  return Math.floor(time ? time - startTime : performance.now() - startTime);
}
