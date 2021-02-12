import { BettererFilePaths, BettererRuns, BettererSummaries, BettererSummary } from '@betterer/betterer';
import { useApp } from 'ink';

export type BettererReporterApp = ReturnType<typeof useApp>;
export type BettererReporterData = {
  filePaths?: BettererFilePaths;
  runs?: BettererRuns;
  summary?: BettererSummary;
  summaries?: BettererSummaries;
};

export type BettererReporterRenderer = {
  render: (data?: BettererReporterData) => void;
  stop: () => void;
};
