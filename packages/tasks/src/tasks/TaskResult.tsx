import type { BettererLog, BettererLogs } from '@betterer/logger';
import type { FC } from '@betterer/render';

import type { BettererTaskLog } from './types.js';

import { codeΔ } from '@betterer/logger';
import { React, Box, Text, memo } from '@betterer/render';
import chalk from 'chalk';

import { BettererErrorLog } from '../error-log.js';
import { BettererTaskStatus } from './status.js';

/**
 * @internal This could change at any point! Please don't use!
 *
 * `props` type for {@link BettererTaskLogger | `<BettererTaskLogger/>`}.
 */
export interface BettererTaskResultProps {
  /**
   * Any error thrown by the {@link BettererTask | `BettererTask`}. It will be `null` if the task completed successfully.
   */
  error: Error | null;
  /**
   * The name of the {@link BettererTask | `BettererTask`} that is shown to the user.
   */
  name: string;
  /**
   * All the logs of the {@link BettererTask | `BettererTask`}.
   */
  logs: BettererLogs;
  /**
   * The final status of the {@link BettererTask | `BettererTask`}.
   */
  status: BettererLog | null;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * Ink component for rendering the final result of a single {@link BettererTask | `BettererTask`}.
 */
export const BettererTaskResult: FC<BettererTaskResultProps> = memo(function BettererTaskResult(props) {
  const { error, name, logs, status } = props;
  const hasStatus = status && Object.keys(status).length !== 0;

  return (
    <Box flexDirection="column">
      {hasStatus && <BettererTaskStatus name={name} status={logToTaskLog(status)} />}
      {logs.length ? (
        <Box flexDirection="column">
          {logs.map((log, index) => (
            <Text key={index}>{prependLogBlock(logToTaskLog(log))}</Text>
          ))}
        </Box>
      ) : null}
      {error && <BettererErrorLog error={error} />}
    </Box>
  );
});

function logToTaskLog(log: BettererLog): BettererTaskLog {
  const { code, debug, error, info, progress, success, warn } = log;
  if (code != null) {
    const codeFrame = codeΔ(code);
    return ['💻', 'whiteBright', codeFrame];
  }
  if (debug != null) {
    return ['🤯', 'blueBright', debug];
  }
  if (error != null) {
    return ['🔥', 'redBright', error];
  }
  if (info != null) {
    return ['💭', 'gray', info];
  }
  if (progress != null) {
    return ['🤔', 'whiteBright', progress];
  }
  if (success != null) {
    return ['✅', 'greenBright', success];
  }
  if (warn != null) {
    return ['🚨', 'yellowBright', warn];
  }
  return ['🔥', 'redBright', 'What the shit did you just try to log???'];
}

function prependLogBlock(log: BettererTaskLog): string {
  const [, colour, message] = log;
  return prependBlock(message, chalk[colour]('・'));
}

function prependBlock(message: string, block: string): string {
  return message
    .split('\n')
    .map((line) => `${block} ${line}`)
    .join('\n');
}
