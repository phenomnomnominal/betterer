import React, { FC, memo, useEffect } from 'react';

import { BettererLoggerCodeInfo, codeΔ } from '@betterer/logger';
import chalk from 'chalk';
import { Box, Text } from 'ink';

import { BettererErrorLog } from '../error-log';
import { BettererTaskStatus } from './status';
import { useTaskState } from './useTaskState';
import { BettererTask, BettererTaskLog } from './types';

export type BettererTaskLoggerProps = {
  task: BettererTask;
};

export const BettererTaskLogger: FC<BettererTaskLoggerProps> = memo(function BettererTaskLogger(props) {
  const { task } = props;
  const { name, run } = task;
  const [state, taskApi] = useTaskState(task);

  const { done, error, messageLogs, running, status } = state;

  useEffect(() => {
    void (async () => {
      if (running || done) {
        return;
      }

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
        const codeFrame = codeΔ(codeInfo);
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
        const result = await run({
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
        } else if (!result) {
          await statusSuccess('done!');
        } else {
          await taskApi.status(result);
        }
        taskApi.stop();
      } catch (error) {
        await statusError((error as Error).message);
        taskApi.error(error);
        process.exitCode = 1;
      }
    })();
  }, []);

  return (
    <Box flexDirection="column">
      {done && status && <BettererTaskStatus name={name} status={status} />}
      {messageLogs.length ? (
        <Box flexDirection="column">
          {messageLogs.map((log, index) => (
            <Text key={index}>{prependLogBlock(log)}</Text>
          ))}
        </Box>
      ) : null}
      {error && <BettererErrorLog error={error} />}
      {!done && status && <BettererTaskStatus name={name} status={status} />}
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
