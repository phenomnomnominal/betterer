import { BettererOptionsOverride } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererSuiteSummary } from '../suite';

export type BettererRunner = {
  options(optionsOverride: BettererOptionsOverride): void;
  queue(filePaths?: string | BettererFilePaths): Promise<void>;
  stop(force?: true): Promise<BettererSuiteSummary | null>;
  stop(): Promise<BettererSuiteSummary>;
};
