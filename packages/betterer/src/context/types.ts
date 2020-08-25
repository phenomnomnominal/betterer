import { BettererFilePaths } from '../watcher';
import { BettererConfig } from '../config';
import { BettererDiff, BettererResult } from '../results';
import { BettererTest } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererTestNames = Array<string>;

export type Resolve = Parameters<ConstructorParameters<typeof Promise>[0]>[0];

export type BettererContext = {
  readonly config: BettererConfig;
};

export type BettererRun = {
  readonly diff: BettererDiff;
  readonly expected: BettererResult;
  readonly files: BettererFilePaths;
  readonly name: string;
  readonly result: BettererResult;
  readonly test: BettererTest;
  readonly timestamp: number;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isNew: boolean;
  readonly isSame: boolean;
  readonly isSkipped: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererStats = {
  readonly better: BettererTestNames;
  readonly completed: BettererTestNames;
  readonly expired: BettererTestNames;
  readonly failed: BettererTestNames;
  readonly new: BettererTestNames;
  readonly ran: BettererTestNames;
  readonly same: BettererTestNames;
  readonly obsolete: BettererTestNames;
  readonly skipped: BettererTestNames;
  readonly updated: BettererTestNames;
  readonly worse: BettererTestNames;
};
