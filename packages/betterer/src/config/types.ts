import { BettererReporter } from '../reporters';

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
 * patterns that match file paths that will be ignored by the file watcher in watch mode.
 */
export type BettererConfigIgnores = ReadonlyArray<string>;

/**
 * @public An array of absolute {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
 * patterns that match file paths that will be included in an operation.
 */
export type BettererConfigIncludes = ReadonlyArray<string>;

/**
 * @public An array of absolute {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file paths }
 * containing **Betterer** tests.
 */
export type BettererConfigPaths = ReadonlyArray<string>;

/**
 * @public Full validated config object for **Betterer**.
 */
export type BettererConfig = BettererConfigBase & BettererConfigStart & BettererConfigWatch;

export type BettererWorkerRunConfig = Omit<BettererConfig, 'reporter'>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Base configuration for all **Betterer** running modes.
 */
export type BettererConfigBase = {
  /**
   * When `true`, caching will be enabled for {@link @betterer/betterer#BettererFileTest | `BettererFileTest`s }.
   * **Betterer** will only check files that have changes since the last test run. **Betterer**
   * will create a cache file at the `configPath`.
   */
  cache: boolean;
  /**
   * The absolute path to where the **Betterer** cache file will be saved. Only used when `cache`
   * is `true`.
   */
  cachePath: string;
  /**
   * An array of absolute {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file paths }
   * containing **Betterer** tests.
   */
  configPaths: BettererConfigPaths;
  /**
   * The current working directory.
   */
  cwd: string;
  /**
   * An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
   * that match names of relevant tests.
   */
  filters: BettererConfigFilters;
  /**
   * The reporter instance. All reporter hooks will be a noop if `silent` is `true`.
   */
  reporter: BettererReporter;
  /**
   * The absolute path to the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   */
  resultsPath: string;
  /**
   * The absolute path to the {@link https://phenomnomnominal.github.io/betterer/docs/betterer-and-typescript | TypeScript configuration file}.
   */
  tsconfigPath: string | null;
  /**
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads} to use when
   * running **Betterer**.
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
   * is enabled. In strict mode, **Betterer** will force `update` to be `false` and will not show
   * the message reminding the user about update mode.
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
};

/**
 * @internal This could change at any point! Please don't use!
 *
 * Configuration for the **Betterer** watch mode.
 */
export type BettererConfigWatch = {
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
};

export type BettererConfigMerge = {
  contents: Array<string>;
  resultsPath: string;
};

/**
 * @public A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file }
 * containing **Betterer** tests, or an array of them.
 */
export type BettererOptionsPaths = Array<string> | string;

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
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern
 * to match file paths that should be ignored by the file watcher in watch mode, or an array of
 * them.
 */
export type BettererOptionsIgnores = Array<string>;

/**
 * @public A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern
 * to match file paths that should be included in an operation, or an array of them.
 */
export type BettererOptionsIncludes = Array<string> | string;

/**
 * @public An array of names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter`},
 * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
 */
export type BettererOptionsReporters = Array<string | BettererReporter>;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary` }
 * via the {@link @betterer/betterer#results | `betterer.results()` API}.
 *
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsResults = Partial<{
  /**
   * A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file }
   * containing **Betterer** tests, or an array of them. All `configPaths` should be relative to
   * the `cwd`.
   * @defaultValue `['./.betterer']`
   */
  configPaths: BettererOptionsPaths;
  /**
   * The current working directory.
   * @defaultValue {@link https://nodejs.org/api/process.html#process_process_cwd | `process.cwd()` }
   */
  cwd: string;
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match file paths that should be excluded from the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
   * or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigExcludes | `BettererConfigExcludes`}.
   * @defaultValue `[]`
   */
  excludes: BettererOptionsExcludes;
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match the names of relevant tests, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern to match
   * file paths that should be included in the {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary`},
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

export type BettererOptionsMerge = Partial<{
  contents: Array<string>;
  cwd: string;
  resultsPath: string;
}>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Base options for **Betterer** all running modes.
 */
export type BettererOptionsBase = Partial<{
  /**
   * When `true`, caching will be enabled for {@link @betterer/betterer#BettererFileTest | `BettererFileTest`s}.
   * Betterer will only check files that have changes since the last test run. **Betterer** will
   * create a cache file at the `configPath`.
   * @defaultValue `false`
   */
  cache: boolean;
  /**
   * The path to where the **Betterer** cache file will be saved. Only used when `cache` is `true`.
   * The `cachePath` should be relative to the `cwd`.
   * @defaultValue `'./.betterer.cache'`
   */
  cachePath: string;
  /**
   * A path to a {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file }
   * containing **Betterer** tests, or an array of them. All `configPaths` should be relative to
   * the `cwd`.
   * @defaultValue `['./.betterer']`
   */
  configPaths: BettererOptionsPaths;
  /**
   * The current working directory.
   * @defaultValue {@link https://nodejs.org/api/process.html#process_process_cwd | `process.cwd()`}
   */
  cwd: string;
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match the names of tests that should be run, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * An array of names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter` }
   * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
   * Ignored when `silent` is `true`.
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
   * When `true`, all reporters will be disabled.
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
   * The number of {@link https://nodejs.org/api/worker_threads.html | worker threads } to use when
   * running tests. When `workers` is `true`, **Betterer** will pick a sensible default.
   * When `workers` is `false` **Betterer** will run in a single thread.
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
     * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
     * to match file paths that should be excluded from {@link @betterer/betterer#BettererFileTest | `BettererFileTest` }
     * runs, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigExcludes | `BettererConfigExcludes`}.
     * @defaultValue `[]`
     */
    excludes: BettererOptionsExcludes;
    /**
     * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern to
     * match file paths that should be included in {@link @betterer/betterer#BettererFileTest | `BettererFileTest` }
     * runs, or an array of them. All `includes` should be relative to the `cwd`.
     * @defaultValue `[]`
     */
    includes: BettererOptionsIncludes;
  }>;

/**
 * @internal This could change at any point! Please don't use!
 *
 * **Betterer** options for when running in CI mode. When `ci` is `true`, `strict` must also be
 * `true` and `precommit`, `update` and `watch` must be falsey.
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
 * **Betterer** options for when running in precommit mode. When `precommit` is `true`, `ci`,
 * `update` and `watch` must be falsey.
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
 * **Betterer** options for when running in strict mode. When `strict` is `true`, `ci`,
 * `precommit`, `update` and `watch` must be falsey.
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
 * **Betterer** options for when running in update mode. When `update` is `true`, `ci`,
 * `precommit`, `strict` and `watch` must be falsey.
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
 *
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 *
 * This is the union of valid possible options for a single **Betterer** run. This type should
 * prevent {@link @betterer/betterer#betterer | `betterer()` } from being called with invalid
 * flags, as some combinations do not make sense.
 */
export type BettererOptionsStart =
  | BettererOptionsStartCI
  | BettererOptionsStartDefault
  | BettererOptionsStartPrecommit
  | BettererOptionsStartStrict
  | BettererOptionsStartUpdate;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner` }
 * via the {@link @betterer/betterer#runner | `betterer.runner()` API}.
 *
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsRunner = BettererOptionsBase;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner` }
 * via the {@link @betterer/betterer#watch | `betterer.watch()` JS API}.
 *
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsWatch = BettererOptionsRunner &
  Partial<{
    /**
     * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern to match
     * file paths that should be ignored by the file watcher in watch mode, or an array of them.
     * All `ignores` should be relative to the `cwd`.
     * @defaultValue `[]`
     */
    ignores: BettererOptionsIgnores;
    watch: true;
  }>;

/**
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 *
 * The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsOverride = Partial<{
  /**
   * A string or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression }
   * to match the names of tests that should be run, or an array of them. Will be converted into {@link @betterer/betterer#BettererConfigFilters | `BettererConfigFilters`}.
   * @defaultValue `[]`
   */
  filters: BettererOptionsFilters;
  /**
   * A {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob } pattern to match
   * file paths that should be ignored by the file watcher in watch mode, or an array of them. All
   * `ignores` should be relative to the `cwd`.
   * @defaultValue `[]`
   */
  ignores: BettererOptionsIgnores;
  /**
   * An array of names of npm packages that export a {@link @betterer/betterer#BettererReporter | `BettererReporter` }
   * or `object`s that implement {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
   * Ignored when `silent` is `true`.
   * @defaultValue `['@betterer/reporter']`
   */
  reporters: BettererOptionsReporters;
}>;
