import type { BettererContext, BettererContextSummary } from '../context/types.js';
import type { BettererFilePaths } from '../fs/index.js';

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern
 * to match file paths that should be ignored by the file watcher in watch mode, or an array of
 * them.
 */
export type BettererOptionsIgnores = Array<string>;

/**
 * @public **Betterer** options for instantiating a file watcher.
 *
 * @remarks The options object will be validated by **Betterer** and will be available on the
 * {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererOptionsWatcher {
  /**
   * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern to match
   * file paths that should be ignored by the file watcher in watch mode, or an array of them.
   * All `ignores` should be relative to the `cwd`.
   * @defaultValue `[]`
   */
  ignores?: BettererOptionsIgnores;
  /**
   * Must be `true` when using Watch mode.
   */
  watch?: true;
}

/**
 * @public Options for when you override the file watcher config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 */
export interface BettererOptionsWatcherOverride {
  /**
   * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern to match
   * file paths that should be ignored by the file watcher in watch mode, or an array of them. All
   * `ignores` should be relative to the `cwd`.
   * @defaultValue `[]`
   */
  ignores?: BettererOptionsIgnores;
}

/**
 * @public An array of absolute {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
 * patterns that match file paths that will be ignored by the file watcher in watch mode.
 */
export type BettererConfigIgnores = ReadonlyArray<string>;

/**
 * @public Full validated config object for a file watcher.
 *
 * @remarks Ths config can be accessed via the {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererConfigWatcher {
  /**
   * An array of absolute {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns that match file paths that will be ignored by the file watcher in watch mode.
   */
  ignores: BettererConfigIgnores;
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#watch-mode | watch mode }
   * is enabled. In watch mode, **Betterer** will run all {@link @betterer/betterer#BettererFileTest | `BettererFileTest`s }
   * whenever a file changes. Only files that are tracked by version control will be watched by
   * default. You can ignore additional files using `ignores`.
   *
   * If `ci`, `precommit`, `strict`, or `update` is `true`, `watch` will be `false`.
   */
  watch: boolean;
}

/**
 * @public The JS API for controlling **Betterer** runs.
 */
export interface BettererRunner extends BettererContext {
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
   * Stop the runner, but first wait for it to finish running the current suite.
   *
   * @returns the {@link @betterer/betterer#BettererContextSummary | `BettererContextSummary`} containing
   * details of all successful runs.
   * @throws the error if something went wrong while stopping everything.
   */
  stop(): Promise<BettererContextSummary>;
  /**
   * Stop the runner, without waiting for it to finish running the suite.
   *
   * @param force - when `true`, the runner will stop immediately and any errors will be ignored.
   * @returns the {@link @betterer/betterer#BettererContextSummary | `BettererContextSummary`} containing
   * details of all successful runs, (or `null` if a run hasn't finished yet).
   */
  stop(force?: true): Promise<BettererContextSummary | null>;
}
