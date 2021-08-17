import { BettererRun, BettererRunSummary } from '@betterer/betterer';
import { useApp } from 'ink';

import { BettererReporterAction } from './state';

export type BettererReporterApp = ReturnType<typeof useApp>;

export type BettererReporterRenderer = {
  render: (action?: BettererReporterAction) => Promise<void>;
  stop: () => void;
};

export type BettererReporterRun = BettererRun & {
  lifecycle: Promise<BettererRunSummary>;
};
