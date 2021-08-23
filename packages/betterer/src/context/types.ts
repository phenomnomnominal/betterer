import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererOptionsOverride } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';

export type BettererContext = {
  readonly config: BettererConfig;
  options(optionsOverride: BettererOptionsOverride): void;
};

export type BettererContextStarted = {
  end(): Promise<BettererContextSummary>;
  error(error: BettererError): Promise<void>;
};

export type BettererContextSummary = Omit<BettererContext, 'options'> & {
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
