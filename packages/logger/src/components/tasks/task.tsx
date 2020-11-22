import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { FC, useContext, useEffect, useState } from 'react';

import { BettererLoggerCodeInfo } from '../../types';
import { codeΔ } from '../../code';
import { BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskContext, BettererTaskLog, BettererTaskLogs } from './types';

export type BettererTaskProps = {
  context: BettererTaskContext;
};

export const BettererTask: FC<BettererTaskProps> = function BettererTask({ context }) {
  const dispatch = useContext(BettererTasksContext);
  const { name, run } = context;
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<BettererTaskLog | null>(null);
  const [logMessages, setLogMessages] = useState<BettererTaskLogs>([]);

  useEffect(() => {
    void (async () => {
      let runLogMessages: BettererTaskLogs = [];
      function addLogMessage(log: BettererTaskLog) {
        runLogMessages = [...runLogMessages, log];
        setLogMessages(runLogMessages);
      }

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
        addLogMessage(['💻', 'magentaBright', codeFrame]);
      }
      function logDebug(log: string): void {
        addLogMessage(['🤯', 'blueBright', log]);
      }
      function logError(log: string): void {
        addLogMessage(['🔥', 'redBright', log]);
      }
      function logInfo(log: string): void {
        addLogMessage(['💭', 'gray', log]);
      }
      function logSuccess(log: string): void {
        addLogMessage(['✅', 'greenBright', log]);
      }
      function logWarning(log: string): void {
        addLogMessage(['🚨', 'yellowBright', log]);
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
        dispatch({ type: 'error', error: error as Error });
        process.exitCode = 1;
      }
      setRunning(false);
    })();
  }, []);

  return (
    <Box flexDirection="column">
      {!running && status && <BettererTaskStatus name={name} status={status} />}
      {logMessages.length ? (
        <Box flexDirection="column">
          {logMessages.map((log, index) => (
            <Text key={`${name}-log-${index}`}>{prependLogBlock(log)}</Text>
          ))}
        </Box>
      ) : null}
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
