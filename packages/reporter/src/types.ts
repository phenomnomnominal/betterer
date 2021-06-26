import {
  BettererFilePaths,
  BettererRuns,
  BettererRunSummaries,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';
import { useApp } from 'ink';

export type BettererReporterApp = ReturnType<typeof useApp>;
export type BettererReporterData = {
  filePaths?: BettererFilePaths;
  runs?: BettererRuns;
  runSummaries?: BettererRunSummaries;
  summary?: BettererSummary;
  summaries?: BettererSummaries;
};

export type BettererReporterRenderer = {
  render: (data?: BettererReporterData) => Promise<void>;
  stop: () => void;
};
