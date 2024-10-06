import type {
  BettererContext,
  BettererContextSummary,
  BettererRunLogger,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import type { BettererTasksDone } from '@betterer/tasks';
import type { BettererLog, BettererLogs } from '@betterer/logger';

export interface BettererReporterState {
  context: BettererContext;
  contextSummary?: BettererContextSummary;
  done?: BettererTasksDone;
  logs: Record<string, BettererLogs>;
  logger: BettererRunLogger;
  status: Record<string, BettererLog>;
  statusLogger: BettererRunLogger;
  suite?: BettererSuite;
  suiteSummary?: BettererSuiteSummary;
}
