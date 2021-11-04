import { BettererOptionsOverride } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererSuiteSummary } from '../suite';

/**
 * @public
 */
export type BettererRunner = {
  /**
   * Make changes to the runner config. The updated config will be used for the next run.
   */
  options(optionsOverride: BettererOptionsOverride): void;
  /**
   *
   * @param filePaths - List of files to test with **Betterer**. If `filePaths` is `undefined` then
   * all files will be tested.
   */
  queue(filePaths?: string | BettererFilePaths): Promise<void>;
  /**
   * Stop the runner, but first wait for it to finish running the suite.
   * @returns - the most recent {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`}.
   */
  stop(): Promise<BettererSuiteSummary>;
  /**
   * Stop the runner, without waiting for it to finish running the suite.
   * @param force (or `null` if a run hasn't finished yet`).
   */
  stop(force: true): Promise<BettererSuiteSummary | null>;
};
