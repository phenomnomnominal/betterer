import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererRunSummaries } from '../run';

export type BettererContext = {
  readonly config: BettererConfig;
};

export type BettererContextStarted = {
  end(): Promise<void>;
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

export type BettererSummary = {
  readonly runs: BettererRunSummaries;
  readonly result: string;
  readonly expected: string | null;
  readonly unexpectedDiff: boolean;

  readonly better: BettererRunSummaries;
  readonly completed: BettererRunSummaries;
  readonly expired: BettererRunSummaries;
  readonly failed: BettererRunSummaries;
  readonly new: BettererRunSummaries;
  readonly ran: BettererRunSummaries;
  readonly same: BettererRunSummaries;
  readonly skipped: BettererRunSummaries;
  readonly updated: BettererRunSummaries;
  readonly worse: BettererRunSummaries;
};

export type BettererSummaries = Array<BettererSummary>;
