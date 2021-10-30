import { Box, useApp } from 'ink';
import React, { FC, memo, useEffect } from 'react';

import { BettererTaskStatus } from './status';
import { useTasksState, BettererTasksContext, BettererTasksState } from './useTasksState';
import { BettererTaskLog, BettererTasksDone, BettererTasksStatusUpdate } from './types';
import { useTimer } from './useTimer';

/**
 * @public `props` type for {@link BettererTasksLogger | `<BettererTasksLogger/>`}.
 */
export type BettererTasksLoggerProps = {
  /**
   * Whether the Ink renderer instance should quit after the tasks are complete.
   *
   * @remarks
   * Should be set this to `false` if the Ink instance is rendering any other components.
   *
   * @defaultValue `true`
   */
  exit?: boolean;
  /**
   * The name of group of task that is shown to the user
   */
  name: string;
  /**
   * An optional hook to customise the output of the task status summary.
   *
   * @defaultValue `() => ${nRunning} tasks running... ${nDone} tasks done! ${nErrored} tasks errored!`
   */
  update?: BettererTasksStatusUpdate;
  /**
   * An optional callback function that is called whenever a set of tasks are completed.
   */
  done?: BettererTasksDone;
};

/**
 * @public Ink component for rendering the output of a set of {@link BettererTask | `BettererTask`s}.
 * The output will update based on the current status of the tasks.
 */
export const BettererTasksLogger: FC<BettererTasksLoggerProps> = memo(function BettererTasksLogger(props) {
  const { children, done = () => void 0, exit = true, name, update = defaultUpdate } = props;

  const app = useApp();

  const [time, clear] = useTimer();

  const [state, tasks] = useTasksState();
  const { startTime, endTime, errors } = state;

  useEffect(() => {
    if (endTime != null) {
      clear();
    }
  }, [endTime, clear]);

  const result = `${update(state)}`;
  let status: BettererTaskLog = ['🌟', 'whiteBright', result];
  if (errors > 0) {
    status = ['💥', 'redBright', result];
  } else if (endTime !== null) {
    status = ['🎉', 'greenBright', result];
  }

  const hasChildren = Array.isArray(children) ? children.length : !!children;

  if (!hasChildren || endTime != null) {
    if (exit) {
      setImmediate(() => app.exit());
    }
    done();
  }

  return (
    <BettererTasksContext.Provider value={[state, tasks]}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name} (${getTime(startTime, endTime || time)}ms)`} status={status} />
        {children}
      </Box>
    </BettererTasksContext.Provider>
  );
});

const FORMATTER = Intl.NumberFormat();

function getTime(startTime: number, time: number) {
  return FORMATTER.format(Math.floor(time - startTime));
}

function defaultUpdate(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tasks(running)} running... ` : '';
  const doneStatus = done ? `${tasks(done)} done! ` : '';
  const errorStatus = errors ? `${tasks(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tasks(n: number): string {
  return `${n} ${n === 1 ? 'task' : 'tasks'}`;
}
