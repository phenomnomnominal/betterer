export type BettererFilePaths = ReadonlyArray<string>;
export type BettererWatchChangeHandler = (filePaths: BettererFilePaths) => Promise<void>;
export type BettererWatchStop = () => Promise<void>;
