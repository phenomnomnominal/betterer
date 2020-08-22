import { BettererRunsΔ, BettererRuns } from '../context';

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererWatchChangeHandlerΔ = (filePaths: BettererFilePaths) => Promise<BettererRunsΔ>;
export type BettererWatchRunHandler = (runs: BettererRuns) => void;

export type BettererWatcher = {
  stop(): Promise<void>;

  onRun(handler: BettererWatchRunHandler): void;
};
