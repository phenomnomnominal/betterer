import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';

export type BettererContext = {
  readonly config: BettererConfig;
};

export type BettererContextStarted = {
  end(): Promise<BettererContextSummary>;
  error(error: BettererError): Promise<void>;
};

export type BettererContextSummary = BettererContext & {
  suites: BettererSuiteSummaries;
  lastSuite: BettererSuiteSummary;
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
