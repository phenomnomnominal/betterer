import type { FC, PropsWithChildren } from '@betterer/render';

import type { BettererTaskLog, BettererTasksDone, BettererTasksStatusUpdate } from './types.js';
import type { BettererTasksState } from './useTasksState.js';

import { React, Box, memo, useApp, useEffect } from '@betterer/render';

import { BettererTaskStatus } from './status.js';
import { BettererTasksContext, useTasksState } from './useTasksState.js';
import { useTimer } from './useTimer.js';

/**
 * @internal This could change at any point! Please don't use!
 *
 * `props` type for {@link BettererTasksLogger | `<BettererTasksLogger/>`}.
 */
export type BettererTasksLoggerProps = PropsWithChildren<{
  /**
   * An optional callback function that is called whenever a set of tasks are completed.
   */
  done?: BettererTasksDone;
  /**
   * Whether the Ink renderer instance should quit after the tasks are complete.
   *
   * @remarks Should be set to `false` if the Ink instance is rendering any other components.
   *
   * @defaultValue `true`
   */
  exit?: boolean;
  /**
   * The name of group of task that is shown to the user
   */
  name: string;
  /**
   * Whether the running time should be rendered.
   *
   * @defaultValue `true`
   */
  timer?: boolean;
  /**
   * An optional hook to customise the output of the task status summary.
   *
   * @defaultValue `() => ${nRunning} tasks running... ${nDone} tasks done! ${nErrored} tasks errored!`
   */
  update?: BettererTasksStatusUpdate;
}>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Ink component for rendering the output of a set of {@link BettererTask | `BettererTask`s}.
 * The output will update based on the current status of the tasks.
 */
export const BettererTasksLogger: FC<BettererTasksLoggerProps> = memo(function BettererTasksLogger(props) {
  const { children, done = () => void 0, exit = true, name, update = defaultUpdate, timer = true } = props;

  const [state, tasksApi] = useTasksState();

  const app = useApp();

  const [time, clear] = useTimer(timer);

  const { startTime, endTime, errors } = state;

  useEffect(() => {
    if (endTime != null) {
      clear();
    }
  }, [endTime, clear]);

  const result = update(state);
  let status: BettererTaskLog = ['🌟', 'whiteBright', result];
  if (errors > 0) {
    status = ['💥', 'redBright', result];
  } else if (endTime !== null) {
    status = ['🎉', 'greenBright', result];
  }

  const hasChildren = Array.isArray(children) ? children.length : !!children;

  if (!hasChildren || endTime != null) {
    if (exit) {
      setImmediate(() => {
        app.exit();
      });
    }
    done();
  }

  const label = timer ? ` (${formatTime(startTime, endTime ?? time)}ms)` : '';

  return (
    <BettererTasksContext.Provider value={[state, tasksApi]}>
      <Box flexDirection="column">
        <BettererTaskStatus name={`${name}${label}`} status={status} />
        {children}
      </Box>
    </BettererTasksContext.Provider>
  );
});

const FORMATTER = Intl.NumberFormat();

function formatTime(startTime: number, time: number) {
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
  return `${String(n)} ${n === 1 ? 'task' : 'tasks'}`;
}
