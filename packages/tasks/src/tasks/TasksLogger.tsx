import { Box, useApp } from 'ink';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { performance } from 'perf_hooks';

import { BettererTaskStatus } from './status';
import { useTasksState, BettererTasksStateContext } from './useTasksState';
import { BettererTaskLog, BettererTasksStatusUpdate } from './types';

const DEFAULT_TASK_TIME_INTERVAL = 100;

export type BettererTasksLoggerProps = {
  exit?: boolean;
  name: string;
  update: BettererTasksStatusUpdate;
};

export const BettererTasksLogger: FC<BettererTasksLoggerProps> = memo(function BettererTasksLogger(props) {
  const { children, exit = true, name, update } = props;
  const app = useApp();

  const [state, api] = useTasksState();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [runningTime, setRunningTime] = useState(performance.now());

  const { errors, endTime, startTime } = state;

  const updateTime = useCallback(() => {
    setRunningTime(performance.now());
  }, [performance]);

  const clearTime = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (endTime) {
      clearTime();
      return;
    }
    timer.current = setInterval(updateTime, DEFAULT_TASK_TIME_INTERVAL);
    updateTime();
    return clearTime;
  }, [updateTime, clearTime, endTime]);

  const result = `${update(state)}`;
  let status: BettererTaskLog = ['🌟', 'whiteBright', result];
  if (errors > 0) {
    status = ['💥', 'redBright', result];
  } else if (endTime !== null) {
    status = ['🎉', 'greenBright', result];
  }

  if (endTime != null) {
    if (exit) {
      setImmediate(() => app.exit());
    }
  }

  return (
    <BettererTasksStateContext.Provider value={api}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name} (${getTime(startTime, endTime || runningTime)}ms)`} status={status} />
        {children}
      </Box>
    </BettererTasksStateContext.Provider>
  );
});

const FORMATTER = Intl.NumberFormat();

function getTime(startTime: number, time: number) {
  return FORMATTER.format(Math.floor(time - startTime));
}
