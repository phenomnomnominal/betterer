import { BettererReporter } from '../reporters';

/**
 * @public An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
 * that match file paths that will be excluded from an operation.
 */
export type BettererConfigExcludes = ReadonlyArray<RegExp>;

/**
 * @public An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
 * that match names of relevant tests.
 */
export type BettererConfigFilters = ReadonlyArray<RegExp>;

/**
 * @public An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob}
 * strings that match file paths that will be ignored by the file watcher in watch mode. Globs
 * should be relative to the `cwd`.
 */
export type BettererConfigIgnores = ReadonlyArray<string>;

/**
 * @public An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob}
 * strings that match file paths that will be included in an operation. Globs should be relative
 * to the `cwd`.
 */
export type BettererConfigIncludes = ReadonlyArray<string>;

/**
 * @public An array of {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file paths}
 * containing **Betterer** tests. File paths should be relative to the `cwd`.
 */
export type BettererConfigPaths = ReadonlyArray<string>;

/**
 * @public Full validated config object for **Betterer**.
 */
export type BettererConfig = BettererConfigBase & BettererConfigStart & BettererConfigRunner & BettererConfigWatch;

export type BettererWorkerRunConfig = Omit<BettererConfig, 'reporter'>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Base configuration for all **Betterer** running modes.
 */
export type BettererConfigBase = {
  /**
   * When set to `true`, caching will be enabled for {@link @betterer/betterer#BettererFileTest | `BettererFileTest`s}.
   * Betterer will only check files that have changes since the last test run. Will create a
   * cache file at the given `configPath`.
   */
  cache: boolean;
  /**
   * The path to where the **Betterer** cache file will be saved. Only used when `cache` is
   * set to `true`. The `cachePath` should be relative to the `cwd`.
   */
  cachePath: string;
  /**
   * An array of {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file paths}
   * containing **Betterer** tests. All `configPaths` should be relative to the `cwd`.
   */
  configPaths: BettererConfigPaths;
  /**
   * The current working directory.
   */
  cwd: string;
  /**
   * Test filter configuration. An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * that match names of relevant tests.
   */
  filters: BettererConfigFilters;
  /**
   * The reporter instance. Will be a noop if **Betterer** was run with `silent` set to `true`.
   */
  reporter: BettererReporter;
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   * The `resultsPath` should be relative to the `cwd`.
   */
  resultsPath: string;
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration}.
   * The `tsconfigPath` should be relative to the `cwd`.
   */
  tsconfigPath: string | null;
  /**
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads} to use when
   * running tests.
   */
  workers: number;
};

/**
 * @internal This could change at any point! Please don't use!
 *
 * Configuration for the default **Betterer** running mode.
 */
export type BettererConfigStart = {
  /**
   * When `true`, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#ci-mode-run-your-tests-and-throw-on-changes | CI mode}
   * is enabled. In CI mode, **Betterer** will throw an error if there is any difference between the
   * test results and the expected results.
   *
   * When `ci` is `true`, `strict` will be `true` and `precommit`, `update` and `watch` will
   * be `false`.
   */
  ci: boolean;
  /**
   * File excludes configuration. An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * that match file paths that will be excluded from {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}
   * runs.
   */
  excludes: BettererConfigExcludes;
  /**
   * File includes configuration. An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob}
   * strings that match file paths that will be included in {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}
   * runs. All `includes` globs should be relative to the `cwd`.
   */
  includes: BettererConfigIncludes;
  /**
   * When true, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#precommit-mode | precommit mode}
   * is enabled. In precommit mode, **Betterer** will automatically add any changes to the results file to
   * the version control system.
   *
   * If `ci` is `true`, `precommit` will be set to `false`. When `precommit` is `true`,
   * `update` and `watch` will be `false`.
   */
  precommit: boolean;
  /**
   * When set to true, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#strict-mode | strict mode}
   * is enabled. In strict mode, **Betterer** will force `update` to be `false` and will not show the message
   * reminding the user about update mode.
   *
   * If `ci` or `precommit` is `true`, `strict` will be set to `false`. When `strict`
   * is set to `true`, `update` and `watch` will be `false`.
   */
  strict: boolean;
  /**
   * When set to true, {@link https://phenomnomnominal.github.io/betterer/docs/running-betterer#update-mode | update mode}
   * is enabled. In update mode, **Betterer** will {@link https://phenomnomnominal.github.io/betterer/docs/updating-results | update the results file},
   * even if the latest test results are worse.
   *
   * If `ci`, `precommit` or `strict` is `true`, `update` will be set to `false`. When `update`
   * is set to `true`, `watch` will be `false`.
   */
  update: boolean;
};

/**
 * @internal This could change at any point! Please don't use!
 *
 * Configuration for a {@link @betterer/betterer#BettererRunner | `BettererRunner`}.
 */
export type BettererConfigRunner = {
  /**
   * File watcher ignore configuration. An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob}
   * strings that match file paths that will be ignored by the file watcher in watch mode. All `ignores`
   * globs should be relative to the `cwd`.
   */
  ignores: BettererConfigIgnores;
};

/**
 * @internal This could change at any point! Please don't use!
 *
 * Configuration for a {@link @betterer/betterer#BettererRunner | `BettererRunner`} in watch mode.
 */
export type BettererConfigWatch = {
  watch: boolean;
};

/**
 * @public A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}
 * containing **Betterer** tests, or an array of them. File paths should be relative to the `cwd`.
 */
export type BettererOptionsPaths = Array<string> | string;

/**
 * @public A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
 * to match file paths that should be excluded from an operation, or an array of them.
 */
export type BettererOptionsExcludes = Array<string | RegExp> | string | RegExp;

/**
 * @public A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
 * to match the names of relevant tests, or an array of them.
 */
export type BettererOptionsFilters = Array<string | RegExp> | string | RegExp;

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} string
 * to match file paths that should be ignored by the file watcher in watch mode, or an array of them.
 */
export type BettererOptionsIgnores = Array<string>;

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} string
 * to match file paths that should be included in an operation, or an array of them.
 */
export type BettererOptionsIncludes = Array<string> | string;

/**
 * @public An array or names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter`},
 * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
 */
export type BettererOptionsReporters = Array<string | BettererReporter>;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`}
 * via the {@link @betterer/betterer#results | `betterer.results()` API}.
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsResults = Partial<{
  /**
   * A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}
   * containing **Betterer** tests, or an array of them. All `configPaths` should be relative to the `cwd`.
   * @defaultValue `['./.betterer']`
   */
  configPaths: BettererOptionsPaths;
  /**
   * The current working directory.
   * @defaultValue {@link https://nodejs.org/api/process.html#process_process_cwd | `process.cwd()`}
   */
  cwd: string;
  /**
   * File excludes configuration. A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * to match file paths that should be excluded from the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
   * or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigExcludes | `BettererConfigExcludes`}.
   * @defaultValue `[]`
   */
  excludes: BettererOptionsExcludes;
  /**
   * Test filter configuration. A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * to match the names of relevant tests, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * File includes configuration. A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} string
   * to match file paths that should be included in the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
   * or an array of them.
   * @defaultValue `[]`
   */
  includes: BettererOptionsIncludes;
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   * The `resultsPath` should be relative to the `cwd`.
   * @defaultValue `'./.betterer.results'`
   */
  resultsPath: string;
}>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Base options for **Betterer** all running modes.
 */
export type BettererOptionsBase = Partial<{
  /**
   * When set to `true`, caching will be enabled for {@link @betterer/betterer#BettererFileTest | `BettererFileTest`s}.
   * Betterer will only check files that have changes since the last test run. Will create a cache
   * file at the given `configPath`.
   * @defaultValue `false`
   */
  cache: boolean;
  /**
   * The path to where the **Betterer** cache file will be saved. Only used when `cache` is
   * set to `true`. The `cachePath` should be relative to the `cwd`.
   * @defaultValue `'./.betterer.cache'`
   */
  cachePath: string;
  /**
   * A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}
   * containing **Betterer** tests, or an array of them. All `configPaths` should be relative to the `cwd`.
   * @defaultValue `['./.betterer']`
   */
  configPaths: BettererOptionsPaths;
  /**
   * The current working directory.
   * @defaultValue {@link https://nodejs.org/api/process.html#process_process_cwd | `process.cwd()`}
   */
  cwd: string;
  /**
   * Test filter configuration. A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * to match the names of tests that should be run, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * Reporter configuration. An array or names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter`},
   * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
   * Ignored when `silent` is set to `true`.
   * @defaultValue `['@betterer/reporter']`
   */
  reporters: BettererOptionsReporters;
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   * The `resultsPath` should be relative to the `cwd`.
   * @defaultValue `'./.betterer.results'`
   */
  resultsPath: string;
  /**
   * When set to `true`, all reporters will be disabled.
   * @defaultValue `false`
   */
  silent: boolean;
  /**
   * The path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration}.
   * The `tsconfigPath` should be relative to the `cwd`.
   * @defaultValue `null`
   */
  tsconfigPath: string;
  /**
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads} to use when
   * running tests. When set to `true`, **Betterer** will pick a sensible default (NUMBER_OF_CPU_CORES - 2).
   * When set to `false` **Betterer** will run in a single thread.
   * @defaultValue `true`
   */
  workers: number | boolean;
}>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Base options for the default **Betterer** running mode.
 */
export type BettererOptionsStartBase = BettererOptionsBase &
  Partial<{
    /**
     * File excludes configuration. A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
     * to match file paths that should be excluded from {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}
     * runs, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigExcludes | `BettererConfigExcludes`}.
     * @defaultValue `[]`
     */
    excludes: BettererOptionsExcludes;
    /**
     * File includes configuration. An array containing {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob}
     * strings to match file paths that should be included.
     * @defaultValue `[]`
     */
    includes: BettererOptionsIncludes;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in CI mode. When `ci` is set to `true`, `strict` must also be
 * set to `true` and `precommit`, `update` and `watch` must be set to `false`.
 */
export type BettererOptionsStartCI = BettererOptionsStartBase &
  Partial<{
    ci: true;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in the default mode. By default `ci`, `precommit`,
 * `strict`, `update` and `watch` are all falsey.
 */
export type BettererOptionsStartDefault = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: false;
    watch: false;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in precommit mode. When `precommit` is set to `true`,
 * `ci`, `update` and `watch` must be falsey.
 */
export type BettererOptionsStartPrecommit = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: true;
    strict: boolean;
    update: false;
    watch: false;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in strict mode. When `strict` is set to `true`,
 * `ci`, `precommit`, `update` and `watch` must be falsey.
 */
export type BettererOptionsStartStrict = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in update mode. When `update` is set to `true`,
 * `ci`, `precommit`, `strict` and `watch` must be falsey.
 */
export type BettererOptionsStartUpdate = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: true;
    watch: false;
  }>;

/**
 * @public Options for when you run **Betterer** via the {@link @betterer/betterer#betterer | JS API}.
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 *
 * This is the union of valid possible options for a single **Betterer** run. This type should prevent {@link @betterer/betterer#betterer | `betterer()` }
 * from being called with invalid flags, as some combinations do not make sense.
 */
export type BettererOptionsStart =
  | BettererOptionsStartCI
  | BettererOptionsStartDefault
  | BettererOptionsStartPrecommit
  | BettererOptionsStartStrict
  | BettererOptionsStartUpdate;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner`}
 * via the {@link @betterer/betterer#runner | `betterer.runner()` API}.
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsRunner = BettererOptionsBase &
  Partial<{
    /**
     * File watcher ignore configuration. A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} string
     * to match file paths that should be ignored by the file watcher in watch mode, or an array of them.
     * @defaultValue `[]`
     */
    ignores: BettererOptionsIgnores;
  }>;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner`}
 * via the {@link @betterer/betterer#watch | `betterer.watch()` JS API}.
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsWatch = BettererOptionsRunner &
  Partial<{
    watch: true;
  }>;

/**
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsOverride = Partial<{
  /**
   * Test filter configuration. A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions}
   * to match the names of tests that should be run, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * File watcher ignore configuration. A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob} string
   * to match file paths that should be ignored by the file watcher in watch mode, or an array of them.
   * @defaultValue `[]`
   */
  ignores: BettererOptionsIgnores;
  /**
   * Reporter configuration. An array or names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter`},
   * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
   * Ignored when `silent` is set to `true`.
   * @defaultValue `['@betterer/reporter']`
   */
  reporters: BettererOptionsReporters;
}>;
