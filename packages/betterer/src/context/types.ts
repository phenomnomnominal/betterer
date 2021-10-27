import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererOptionsOverride } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';

/**
 * @public A `BettererContext` represents the context of a set of test suite runs.
 */
export type BettererContext = {
  /**
   * The current {@link @betterer/betterer#BettererConfig | config} of the context. You probably don't want to mess with this directly 🔥.
   */
  readonly config: BettererConfig;
  /**
   * Make changes to the context config. The new config will be used for the next run.
   */
  options(optionsOverride: BettererOptionsOverride): Promise<void>;
  /**
   * Stop the current config and clean everything up. If tests are currently running, it will
   * wait for them to finish before stopping.
   */
  stop(): Promise<BettererSuiteSummary>;
};

export type BettererContextStarted = {
  end(): Promise<BettererContextSummary>;
  error(error: BettererError): Promise<void>;
};

/**
 * @public A `BettererContextSummary` represents the result of a set of test suite runs.
 */
export type BettererContextSummary = {
  /**
   * The {@link @betterer/betterer#BettererConfig | config} for the last test suite run.
   */
  readonly config: BettererConfig;
  /**
   * The {@link @betterer/betterer#BettererSuiteSummaries | `BettererSuiteSummaries`} for all
   * test suite runs completed by this context.
   */
  suites: BettererSuiteSummaries;
  /**
   * The {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`} for the last
   * test suite run.
   */
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
