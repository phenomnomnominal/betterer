import React, { FC, useEffect, useState } from 'react';
import chalk from 'chalk';
import { Box, Text } from 'ink';

import { BettererLoggerStatus } from './status';
import {
  BettererLoggerTaskContext,
  BettererLoggerTaskError,
  BettererLoggerTaskStatus,
  BettererLoggerTaskStatusMessages
} from './types';

export type BettererLoggerTaskProps = {
  context: BettererLoggerTaskContext;
};

export const BettererLoggerTask: FC<BettererLoggerTaskProps> = function BettererLoggerTask({ context }) {
  const { name, run } = context;
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<BettererLoggerTaskStatus | null>(null);
  const [logMessages, setLogMessages] = useState<BettererLoggerTaskStatusMessages>([]);

  useEffect(() => {
    (async () => {
      let statusMessages: BettererLoggerTaskStatusMessages = [];
      try {
        const result = await run({
          status(status: string) {
            setStatus(['🤔', 'whiteBright', status]);
          },
          debug(status: string) {
            statusMessages = [...statusMessages, ['🤯', 'blueBright', status]];
            setLogMessages(statusMessages);
          },
          info(status: string) {
            statusMessages = [...statusMessages, ['💬', 'gray', status]];
            setLogMessages(statusMessages);
          },
          warn(status: string) {
            statusMessages = [...statusMessages, ['🚨', 'yellowBright', status]];
            setLogMessages(statusMessages);
          }
        });

        if (typeof result === 'string') {
          setStatus(['✅', 'greenBright', result]);
        } else if (!result) {
          setStatus(['✅', 'greenBright', 'done!']);
        } else {
          setStatus(result);
        }
      } catch (error) {
        const [status, ...logs] = errorMessages(error);
        setStatus(status);
        statusMessages = [...statusMessages, ...logs];
        setLogMessages(statusMessages);
        process.exitCode = 1;
      }
      setRunning(false);
    })();
  }, []);

  if (running) {
    return (
      <Box flexDirection="column">
        {running &&
          logMessages.map((log, index) => (
            <BettererLoggerStatus key={`${name}-log-${index}`} name={name} status={log} />
          ))}
        {status && <BettererLoggerStatus name={name} status={status} />}
      </Box>
    );
  }
  return (
    <Box flexDirection="column">
      {status && <BettererLoggerStatus name={name} status={status} />}
      {logMessages.length ? (
        <Box flexDirection="column">
          {logMessages.map((message, index) => (
            <Text key={`${name}-log-${index}`}>{prependLogBlock(message)}</Text>
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

function errorMessages(error: BettererLoggerTaskError): BettererLoggerTaskStatusMessages {
  const messages = [error.message, error.details, error.stack].filter(Boolean) as Array<string>;
  return messages.map((message) => ['🔥', 'redBright', message]);
}

function prependLogBlock(log: BettererLoggerTaskStatus): string {
  const [, colour, message] = log;
  return prependBlock(message, chalk[colour]('   ▸'));
}

function prependBlock(message: string, block: string): string {
  return message
    .toString()
    .split('\n')
    .map((line) => `${block} ${line}`)
    .join('\n');
}
