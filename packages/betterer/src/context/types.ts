import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererResult } from '../results';
import { BettererFilePaths } from '../runner';
import { BettererDiff, BettererTestConfig } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererContext = {
  readonly config: BettererConfig;
  readonly lifecycle: Promise<BettererSummaries>;
};

export type BettererContextStarted = {
  end(write: boolean): Promise<void>;
  error(error: BettererError): Promise<void>;
};

export type BettererDelta =
  | {
      readonly baseline: number;
      readonly diff: number;
      readonly result: number;
    }
  | {
      readonly baseline: null;
      readonly diff: 0;
      readonly result: number;
    };

export type BettererRun = {
  readonly diff: BettererDiff;
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths;
  readonly lifecycle: Promise<void>;
  readonly name: string;
  readonly delta: BettererDelta | null;
  readonly result: BettererResult;
  readonly test: BettererTestConfig;
  readonly timestamp: number;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isNew: boolean;
  readonly isObsolete: boolean;
  readonly isSame: boolean;
  readonly isSkipped: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererRunStarted = {
  better(result: BettererResult, isComplete: boolean): Promise<void>;
  failed(error: BettererError): Promise<void>;
  neww(result: BettererResult, isComplete: boolean): Promise<void>;
  same(result: BettererResult): Promise<void>;
  skipped(): Promise<void>;
  update(result: BettererResult): Promise<void>;
  worse(result: BettererResult): Promise<void>;
};

export type BettererSummary = {
  readonly runs: BettererRuns;
  readonly result: string;
  readonly expected: string | null;
  readonly unexpectedDiff: boolean;

  readonly better: BettererRuns;
  readonly completed: BettererRuns;
  readonly expired: BettererRuns;
  readonly failed: BettererRuns;
  readonly new: BettererRuns;
  readonly obsolete: BettererRuns;
  readonly ran: BettererRuns;
  readonly same: BettererRuns;
  readonly skipped: BettererRuns;
  readonly updated: BettererRuns;
  readonly worse: BettererRuns;
};

export type BettererSummaries = Array<BettererSummary>;
