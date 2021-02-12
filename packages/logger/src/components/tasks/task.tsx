import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { FC, memo, useEffect } from 'react';

import { BettererLoggerCodeInfo } from '../../types';
import { code } from '../../code';
import { BettererErrorLog } from '../error-log';
import { BettererTaskStatus } from './status';
import { useTaskState } from './useTaskState';
import { BettererTaskRunner, BettererTaskLog } from './types';

export type BettererTaskProps = {
  name: string;
  runner: BettererTaskRunner;
};

export const BettererTask: FC<BettererTaskProps> = memo(function BettererTask(props) {
  const { name, runner } = props;
  const [state, task] = useTaskState(runner);

  const { done, error, messageLogs, running, status } = state;

  useEffect(() => {
    void (async () => {
      if (running || done) {
        return;
      }

      async function statusError(status: string): Promise<void> {
        await task.status(['🔥', 'redBright', status]);
      }
      async function statusProgress(status: string): Promise<void> {
        await task.status(['🤔', 'whiteBright', status]);
      }
      async function statusSuccess(status: string): Promise<void> {
        await task.status(['✅', 'greenBright', status]);
      }

      async function logCode(codeInfo: BettererLoggerCodeInfo): Promise<void> {
        const codeFrame = code(codeInfo);
        await task.log(['💻', 'whiteBright', codeFrame]);
      }
      async function logDebug(log: string): Promise<void> {
        await task.log(['🤯', 'blueBright', log]);
      }
      async function logError(log: string): Promise<void> {
        await task.log(['🔥', 'redBright', log]);
      }
      async function logInfo(log: string): Promise<void> {
        await task.log(['💭', 'gray', log]);
      }
      async function logSuccess(log: string): Promise<void> {
        await task.log(['✅', 'greenBright', log]);
      }
      async function logWarning(log: string): Promise<void> {
        await task.log(['🚨', 'yellowBright', log]);
      }

      task.start();
      try {
        const result = await runner({
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
          await task.status(result);
        }
        task.stop();
      } catch (error) {
        await statusError((error as Error).message);
        task.error(error);
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
            <Text key={`${name}-log-${index}`}>{prependLogBlock(log)}</Text>
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
