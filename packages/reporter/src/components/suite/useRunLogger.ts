import type { BettererRun, BettererRunLogger } from '@betterer/betterer';
import type {
  BettererLog,
  BettererLogger,
  BettererLogs,
  BettererLoggerMessages,
  BettererLoggerCodeInfo
} from '@betterer/logger';

import { useRef } from '@betterer/render';

import { invariantΔ } from '@betterer/errors';

import { useReporterState } from '../../state/index.js';

export function useRunReporterState(run: BettererRun): [BettererLogs, BettererLogger, BettererLog, BettererLogger] {
  const { logs, logger, status, statusLogger } = useReporterState();

  const runLogs = logs[run.name];
  invariantΔ(runLogs, '`logs[run.name]` should have been initialised in the `suiteStart` action!');
  const runLogger = useRef(createLogger(logger, run));
  const runStatus = status[run.name];
  invariantΔ(runStatus !== undefined, '`status[run.name]` should have been initialised in the `suiteStart` action!');
  const runStatusLogger = useRef(createLogger(statusLogger, run));
  return [runLogs, runLogger.current, runStatus, runStatusLogger.current];
}

function createLogger(runLogger: BettererRunLogger, run: BettererRun): BettererLogger {
  return {
    async code(codeInfo: BettererLoggerCodeInfo): Promise<void> {
      await runLogger.code(run, codeInfo);
    },
    async debug(...debug: BettererLoggerMessages): Promise<void> {
      await runLogger.debug(run, ...debug);
    },
    async error(...error: BettererLoggerMessages): Promise<void> {
      await runLogger.error(run, ...error);
    },
    async info(...info: BettererLoggerMessages): Promise<void> {
      await runLogger.info(run, ...info);
    },
    async progress(...progress: BettererLoggerMessages): Promise<void> {
      await runLogger.progress(run, ...progress);
    },
    async success(...success: BettererLoggerMessages): Promise<void> {
      await runLogger.success(run, ...success);
    },
    async warn(...warn: BettererLoggerMessages): Promise<void> {
      await runLogger.warn(run, ...warn);
    }
  };
}
