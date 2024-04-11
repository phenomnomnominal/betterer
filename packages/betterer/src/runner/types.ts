import type { BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';

/**
 * @public A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
 * to match file paths that should be excluded from an operation, or an array of them.
 */
export type BettererOptionsExcludes = Array<string | RegExp> | string | RegExp;

/**
 * @public A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
 * to match the names of relevant tests, or an array of them.
 */
export type BettererOptionsFilters = Array<string | RegExp> | string | RegExp;

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern
 * to match file paths that should be included in an operation, or an array of them.
 */
export type BettererOptionsIncludes = Array<string> | string;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in CI mode. When `ci` is `true`, `strict` must also be
 * `true` and `precommit`, `update` and `watch` must be falsey.
 */
export interface BettererOptionsMode {
  ci?: false;
  precommit?: false;
  strict?: false;
  update?: false;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in CI mode. When `ci` is `true`, `strict` must also be
 * `true` and `precommit`, `update` and `watch` must be falsey.
 */
export interface BettererOptionsModeCI {
  ci?: true;
  precommit?: false;
  strict?: true;
  update?: false;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in precommit mode. When `precommit` is `true`, `ci`,
 * `update` and `watch` must be falsey.
 */
export interface BettererOptionsModePrecommit {
  ci?: false;
  precommit?: true;
  strict?: boolean;
  update?: false;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in strict mode. When `strict` is `true`, `ci`,
 * `precommit`, `update` and `watch` must be falsey.
 */
export interface BettererOptionsModeStrict {
  ci?: false;
  precommit?: false;
  strict?: true;
  update?: false;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in update mode. When `update` is `true`, `ci`,
 * `precommit`, `strict` and `watch` must be falsey.
 */
export interface BettererOptionsModeUpdate {
  ci?: false;
  precommit?: false;
  strict?: false;
  update?: true;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in watch mode. When `watch` is `true`, `ci`,
 * `precommit`, `strict` and `update` must be falsey.
 */
export interface BettererOptionsModeWatch {
  ci?: false;
  precommit?: false;
  strict?: false;
  update?: false;
}

export type BettererOptionsModeAll =
  | BettererOptionsModeCI
  | BettererOptionsModePrecommit
  | BettererOptionsModeStrict
  | BettererOptionsModeUpdate
  | BettererOptionsModeWatch;

export type BettererOptionsModeStart =
  | BettererOptionsMode
  | BettererOptionsModeCI
  | BettererOptionsModePrecommit
  | BettererOptionsModeStrict
  | BettererOptionsModeUpdate;

export type BettererOptionsModeRunner =
  | BettererOptionsMode
  | BettererOptionsModeCI
  | BettererOptionsModePrecommit
  | BettererOptionsModeStrict
  | BettererOptionsModeUpdate;

export type BettererOptionsRunner = BettererOptionsModeRunner & {
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match file paths that should be excluded from the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
   * or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigExcludes | `BettererConfigExcludes`}.
   * @defaultValue `[]`
   */
  excludes?: BettererOptionsExcludes;
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match the names of relevant tests, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters?: BettererOptionsFilters;
  /**
   * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern to match
   * file paths that should be included in the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
   * or an array of them.
   * @defaultValue `[]`
   */
  includes?: BettererOptionsIncludes;
  /**
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads } to use when
   * running tests. When `workers` is `true`, **Betterer** will pick a sensible default.
   * When `workers` is `false` **Betterer** will run in a single thread.
   * @defaultValue `true`
   */
  workers?: number | boolean;
};

/**
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererOptionsRunnerOverride {
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match the names of tests that should be run, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters?: BettererOptionsFilters;
}

/**
 * @public An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
 * that match file paths that will be excluded from an operation.
 */
export type BettererConfigExcludes = ReadonlyArray<RegExp>;

/**
 * @public An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
 * that match names of relevant tests.
 */
export type BettererConfigFilters = ReadonlyArray<RegExp>;

/**
 * @public An array of absolute {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
 * patterns that match file paths that will be included in an operation.
 */
export type BettererConfigIncludes = ReadonlyArray<string>;

export interface BettererConfigRunner {
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#ci-mode-run-your-tests-and-throw-on-changes | CI mode }
   * is enabled. In CI mode, **Betterer** will throw an error if there is any difference between
   * the test results and the expected results.
   *
   * When `ci` is `true`, `strict` will be `true` and `precommit`, `update` and `watch` will be
   * `false`.
   */
  ci: boolean;
  /**
   * An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
   * that match file paths that will be excluded from {@link @betterer/betterer#BettererFileTest | `BettererFileTest` }
   * runs.
   */
  excludes: BettererConfigExcludes;
  /**
   * An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
   * that match names of relevant tests.
   */
  filters: BettererConfigFilters;
  /**
   * An array of absolute {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns that match file paths that will be included in {@link @betterer/betterer#BettererFileTest | `BettererFileTest` }
   * runs.
   */
  includes: BettererConfigIncludes;
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#precommit-mode | precommit mode }
   * is enabled. In precommit mode, **Betterer** will automatically add the results file to the
   * current commit if it contains any changes.
   *
   * If `ci` is `true`, `precommit` will be `false`. When `precommit` is `true`, `update` and
   * `watch` will be `false`.
   */
  precommit: boolean;
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#strict-mode | strict mode }
   * is enabled. In strict mode, **Betterer** will force `update` to be `false` and will not show the message
   * reminding the user about update mode.
   *
   * If `ci` or `precommit` is `true`, `strict` will be `false`. When `strict` is `true`, `update`
   * and `watch` will be `false`.
   */
  strict: boolean;
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#update-mode | update mode }
   * is enabled. In update mode, **Betterer** will {@link https://phenomnomnominal.github.io/betterer/docs/updating-results | update the results file},
   * even if the latest test results are worse than the current results.
   *
   * If `ci`, `precommit` or `strict` is `true`, `update` will be `false`. When `update` is `true`,
   * `watch` will be `false`.
   */
  update: boolean;
  /**
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads} to use when
   * running **Betterer**.
   */
  workers: number;
}

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} pattern
 * to match file paths that should be ignored by the file watcher in watch mode, or an array of
 * them.
 */
export type BettererOptionsIgnores = Array<string>;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner` }
 * via the {@link @betterer/betterer#watch | `betterer.watch()` JS API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
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
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
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
 * @internal This could change at any point! Please don't use!
 *
 * Configuration for the **Betterer** watch mode.
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
