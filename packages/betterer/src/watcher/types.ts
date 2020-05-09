import { BettererRuns } from '../context';

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererWatchChangeHandler = (filePaths: BettererFilePaths) => Promise<BettererRuns>;
export type BettererWatchRunHandler = (runs: BettererRuns) => void;
export type BettererWatchStop = () => Promise<void>;
