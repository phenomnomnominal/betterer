import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { FC, useContext, useEffect, useState } from 'react';

import { BettererLoggerCodeInfo } from '../../types';
import { codeΔ } from '../../code';
import { BettererTaskError } from './error';
import { BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskContext, BettererTaskLog } from './types';
import { useTaskLogs } from './use-task-logs';

export type BettererTaskProps = {
  context: BettererTaskContext;
};

export const BettererTask: FC<BettererTaskProps> = function BettererTask({ context }) {
  const dispatch = useContext(BettererTasksContext);
  const { name, run } = context;
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<BettererTaskLog | null>(null);
  const [messageLogs, setMessageLogs] = useTaskLogs();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    void (async () => {
      function statusError(status: string): void {
        setStatus(['🔥', 'redBright', status]);
      }
      function statusProgress(status: string): void {
        setStatus(['🤔', 'whiteBright', status]);
      }
      function statusSuccess(status: string): void {
        setStatus(['✅', 'greenBright', status]);
      }

      function logCode(codeInfo: BettererLoggerCodeInfo): void {
        const { message } = codeInfo;
        const codeFrame = codeΔ(codeInfo);
        logInfo(message.trim());
        setMessageLogs(['💻', 'magentaBright', codeFrame]);
      }
      function logDebug(log: string): void {
        setMessageLogs(['🤯', 'blueBright', log]);
      }
      function logError(log: string): void {
        setMessageLogs(['🔥', 'redBright', log]);
      }
      function logInfo(log: string): void {
        setMessageLogs(['💭', 'gray', log]);
      }
      function logSuccess(log: string): void {
        setMessageLogs(['✅', 'greenBright', log]);
      }
      function logWarning(log: string): void {
        setMessageLogs(['🚨', 'yellowBright', log]);
      }

      dispatch({ type: 'start' });
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
          statusSuccess(result);
        } else if (!result) {
          statusSuccess('done!');
        } else {
          setStatus(result);
        }

        dispatch({ type: 'stop' });
      } catch (error) {
        statusError((error as Error).message);
        setError(error);
        dispatch({ type: 'error' });
        process.exitCode = 1;
      }
      setRunning(false);
    })();
  }, []);

  return (
    <Box flexDirection="column">
      {!running && status && <BettererTaskStatus name={name} status={status} />}
      {messageLogs.length ? (
        <Box flexDirection="column">
          {messageLogs.map((log, index) => (
            <Text key={`${name}-log-${index}`}>{prependLogBlock(log)}</Text>
          ))}
        </Box>
      ) : null}
      {error && <BettererTaskError error={error} />}
      {running && status && <BettererTaskStatus name={name} status={status} />}
    </Box>
  );
};

function prependLogBlock(log: BettererTaskLog): string {
  const [, colour, message] = log;
  return prependBlock(message, chalk[colour]('  ▸'));
}

function prependBlock(message: string, block: string): string {
  return message
    .toString()
    .split('\n')
    .map((line) => `${block} ${line}`)
    .join('\n');
}
