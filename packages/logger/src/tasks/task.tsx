import React, { FC, useContext, useEffect, useState } from 'react';
import chalk from 'chalk';
import { Box, Text } from 'ink';

import { BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskContext, BettererTaskError, BettererTaskStatusMessage, BettererTaskStatusMessages } from './types';

export type BettererTaskProps = {
  context: BettererTaskContext;
};

export const BettererTask: FC<BettererTaskProps> = function BettererTask({ context }) {
  const dispatch = useContext(BettererTasksContext);
  const { name, run } = context;
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<BettererTaskStatusMessage | null>(null);
  const [logMessages, setLogMessages] = useState<BettererTaskStatusMessages>([]);

  useEffect(() => {
    (async () => {
      let statusMessages: BettererTaskStatusMessages = [];
      dispatch({ type: 'start' });
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
        dispatch({ type: 'stop' });
      } catch (error) {
        const [status, ...logs] = errorMessages(error);
        setStatus(status);
        statusMessages = [...statusMessages, ...logs];
        setLogMessages(statusMessages);
        dispatch({ type: 'error' });
        process.exitCode = 1;
      }
      setRunning(false);
    })();
  }, []);

  if (running) {
    return (
      <Box flexDirection="column">
        {running &&
          logMessages.map((log, index) => <BettererTaskStatus key={`${name}-log-${index}`} name={name} status={log} />)}
        {status && <BettererTaskStatus name={name} status={status} />}
      </Box>
    );
  }
  return (
    <Box flexDirection="column">
      {status && <BettererTaskStatus name={name} status={status} />}
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

function errorMessages(error: BettererTaskError): BettererTaskStatusMessages {
  const messages = [error.message, error.details, error.stack].filter(Boolean) as Array<string>;
  return messages.map((message) => ['🔥', 'redBright', message]);
}

function prependLogBlock(log: BettererTaskStatusMessage): string {
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
