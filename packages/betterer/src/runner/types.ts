import type { BettererOptionsOverride } from '../config';
import type { BettererFilePaths } from '../fs';
import type { BettererSuiteSummary } from '../suite';

/**
 * @public The JS API for controlling **Betterer** runs.
 */
export interface BettererRunner {
  /**
   * Make changes to the runner config. The updated config will be used for the next run.
   */
  options(optionsOverride: BettererOptionsOverride): void;
  /**
   * Queue a **Betterer** run.
   *
   * @param filePaths - List of files to test with **Betterer**. If `filePaths` is `undefined` then
   * all files will be tested.
   * @throws {@link @betterer/errors#BettererError | `BettererError` }
   * Will throw if something goes wrong while running **Betterer**.
   */
  queue(filePaths?: string | BettererFilePaths): Promise<void>;
  /**
   * Stop the runner, but first wait for it to finish running the suite.
   *
   * @returns the most recent {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`}.
   * @throws the error if something went wrong while stopping everything.
   */
  stop(): Promise<BettererSuiteSummary>;
  /**
   * Stop the runner, without waiting for it to finish running the suite.
   *
   * @param force - when `true`, the runner will stop immediately and any errors will be ignored.
   * @returns the most recent {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`}.
   * (or `null` if a run hasn't finished yet).
   */
  stop(force: true): Promise<BettererSuiteSummary | null>;
}
