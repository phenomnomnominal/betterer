import React, { FC, memo, useEffect } from 'react';

import { BettererLoggerCodeInfo, code__ } from '@betterer/logger';
import chalk from 'chalk';
import { Box, Text } from 'ink';

import { BettererErrorLog } from '../error-log';
import { BettererTaskStatus } from './status';
import { useTaskState } from './useTaskState';
import { BettererTaskLog, BettererTask } from './types';
import { useTasks } from './useTasksState';

/**
 * @public `props` type for {@link BettererTaskLogger | `<BettererTaskLogger/>`}
 */
export type BettererTaskLoggerProps = {
  /**
   * The name of the task that is shown to the user
   */
  name: string;
  /**
   * The task to be run
   */
  task: BettererTask;
};

/**
 * @public Ink component for rendering the output of a single {@link BettererTask | `BettererTask`}.
 * The output will update based on the current status of the task. Once the task is finished, it will
 * output any logging and any errors (if the task failed).
 */
export const BettererTaskLogger: FC<BettererTaskLoggerProps> = memo(function BettererTaskLogger(props) {
  const { name, task } = props;
  const [tasksState] = useTasks();
  const [taskState, taskApi] = useTaskState();

  const { error, logs, status } = taskState;

  useEffect(() => {
    void (async () => {
      taskApi.reset();

      async function statusError(status: string): Promise<void> {
        await taskApi.status(['🔥', 'redBright', status]);
      }
      async function statusProgress(status: string): Promise<void> {
        await taskApi.status(['🤔', 'whiteBright', status]);
      }
      async function statusSuccess(status: string): Promise<void> {
        await taskApi.status(['✅', 'greenBright', status]);
      }

      async function logCode(codeInfo: BettererLoggerCodeInfo): Promise<void> {
        const codeFrame = code__(codeInfo);
        await taskApi.log(['💻', 'whiteBright', codeFrame]);
      }
      async function logDebug(log: string): Promise<void> {
        await taskApi.log(['🤯', 'blueBright', log]);
      }
      async function logError(log: string): Promise<void> {
        await taskApi.log(['🔥', 'redBright', log]);
      }
      async function logInfo(log: string): Promise<void> {
        await taskApi.log(['💭', 'gray', log]);
      }
      async function logSuccess(log: string): Promise<void> {
        await taskApi.log(['✅', 'greenBright', log]);
      }
      async function logWarning(log: string): Promise<void> {
        await taskApi.log(['🚨', 'yellowBright', log]);
      }

      taskApi.start();
      try {
        const result = await task({
          progress: statusProgress,
          code: logCode,
          debug: logDebug,
          error: logError,
          info: logInfo,
          success: logSuccess,
          warn: logWarning
        });

        if (typeof result === 'string') {
          await statusSuccess(result);
        } else {
          await statusSuccess('done!');
        }
        taskApi.stop();
      } catch (error) {
        await statusError((error as Error).message);
        taskApi.error(error as Error);
        process.exitCode = 1;
      }
    })();
  }, [name, task, taskApi]);

  return (
    <Box flexDirection="column">
      {status && <BettererTaskStatus name={name} status={status} />}
      {tasksState.endTime != null && logs.length ? (
        <Box flexDirection="column">
          {logs.map((log, index) => (
            <Text key={index}>{prependLogBlock(log)}</Text>
          ))}
        </Box>
      ) : null}
      {error && <BettererErrorLog error={error} />}
    </Box>
  );
});

function prependLogBlock(log: BettererTaskLog): string {
  const [, colour, message] = log;
  return prependBlock(message, chalk[colour]('・'));
}

function prependBlock(message: string, block: string): string {
  return message
    .toString()
    .split('\n')
    .map((line) => `${block} ${line}`)
    .join('\n');
}
