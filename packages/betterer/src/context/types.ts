import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererOptionsOverride } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';

export type BettererContext = {
  readonly config: BettererConfig;
  options(optionsOverride: BettererOptionsOverride): Promise<void>;
  stop(): Promise<BettererSuiteSummary>;
};

export type BettererContextStarted = {
  end(): Promise<BettererContextSummary>;
  error(error: BettererError): Promise<void>;
};

export type BettererContextSummary = {
  readonly config: BettererConfig;
  suites: BettererSuiteSummaries;
  lastSuite: BettererSuiteSummary;
};
