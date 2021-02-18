import { BettererSummary } from '../context';

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererWatchChangeHandler = (filePaths: BettererFilePaths) => Promise<BettererSummary>;

export type BettererWatcher = {
  stop(): Promise<void>;
};
