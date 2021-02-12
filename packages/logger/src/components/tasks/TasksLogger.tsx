import { Box, useApp } from 'ink';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { performance } from 'perf_hooks';

import { BettererTaskStatus } from './status';
import { useTasksState, BettererTasksStateContext } from './useTasksState';
import { BettererTaskLog, BettererTasksStatusUpdate, BettererTasks } from './types';
import { BettererTaskLogger } from './TaskLogger';

const DEFAULT_TASK_TIME_INTERVAL = 10;

export type BettererTasksLoggerProps = {
  exit?: boolean;
  name: string;
  update: BettererTasksStatusUpdate;
  tasks: BettererTasks;
};

export const BettererTasksLogger: FC<BettererTasksLoggerProps> = memo(function BettererTasksLogger(props) {
  const { exit = true, name, update, tasks } = props;
  const app = useApp();
  const formatter = Intl.NumberFormat();

  const [state, api] = useTasksState(tasks);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(0);

  const { errors, shouldExit, startTime } = state;

  const updateTime = useCallback(() => {
    setTime(performance.now());
  }, []);

  const clearTime = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (shouldExit) {
      clearTime();
      return;
    }
    timer.current = setInterval(updateTime, DEFAULT_TASK_TIME_INTERVAL);
    updateTime();
    return clearTime;
  }, [shouldExit]);

  const result = `${update(state)}`;
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
        {tasks.map((task, index) => (
          <BettererTaskLogger key={index} task={task} />
        ))}
      </Box>
    </BettererTasksStateContext.Provider>
  );
});

function getTime(startTime: number, time: number) {
  return Math.floor(time ? time - startTime : performance.now() - startTime);
}
