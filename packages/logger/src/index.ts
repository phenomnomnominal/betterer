/**
 * Logger used within {@link https://github.com/phenomnomnominal/betterer | **Betterer**}.
 *
 * @packageDocumentation
 */

export type {
  BettererLogger,
  BettererLog,
  BettererLogMessage,
  BettererLogCode,
  BettererLogs,
  BettererLoggerCodeInfo,
  BettererLoggerMessage,
  BettererLoggerMessages
} from './types.js';

export { code__ } from './code.js';
export { diff__, diffStrings__ } from './diff.js';
export { log__ } from './log.js';
