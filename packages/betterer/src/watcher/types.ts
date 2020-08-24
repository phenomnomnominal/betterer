import { BettererRunsΩ, BettererRuns } from '../context';

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererWatchChangeHandlerΩ = (filePaths: BettererFilePaths) => Promise<BettererRunsΩ>;
export type BettererWatchRunHandler = (runs: BettererRuns) => void;

export type BettererWatcher = {
  stop(): Promise<void>;

  onRun(handler: BettererWatchRunHandler): void;
};
