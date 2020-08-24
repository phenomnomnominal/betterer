import { BettererFilePaths } from '../watcher';
import { BettererConfig } from '../config';
import { NO_PREVIOUS_RESULT } from '../results';
import { BettererTest } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererTestNames = Array<string>;

export type Resolve = Parameters<ConstructorParameters<typeof Promise>[0]>[0];

export type BettererContext = {
  readonly config: BettererConfig;

  getAbsolutePathΔ(path: string): string;
  getRelativePathΔ(path: string): string;
};

export type BettererRun = {
  readonly context: BettererContext;
  readonly expected: unknown | typeof NO_PREVIOUS_RESULT;
  readonly files: BettererFilePaths;
  readonly result: unknown;
  readonly shouldPrint: boolean;
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

  diff(): void;
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
