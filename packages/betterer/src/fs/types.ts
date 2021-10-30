import { WorkerRequireModule, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';

/**
 * @public An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
 * patterns that match file paths that will be included in an operation. All globs should be
 * relative to the current {@link @betterer/betterer#BettererConfig.cwd | `BettererConfig.cwd`}.
 *
 * Can contain nested arrays, which will be {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | flattened}.
 */
export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;

/**
 * @public The path to a file on disk.
 */
export type BettererFilePath = string;

/**
 * @public An array of paths to files on disk.
 */
export type BettererFilePaths = ReadonlyArray<BettererFilePath>;

/**
 * @public An array of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expressions }
 * that match file paths that will be excluded from an operation.
 *
 * Can contain nested arrays, which will be {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | flattened}.
 */
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFileHashMap = Record<string, string>;
export type BettererTestCacheMap = Record<string, BettererFileHashMap>;
export type BettererCacheFile = {
  version: number;
  testCache: BettererTestCacheMap;
};

export type BettererFileCache = {
  clearCache(testName: string): void;
  filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths;
  enableCache(cachePath: string): Promise<void>;
  updateCache(testName: string, filePaths: BettererFilePaths): void;
  writeCache(): Promise<void>;
};

export type BettererVersionControl = BettererFileCache & {
  add(resultsPath: string): Promise<void>;
  getFilePaths(): BettererFilePaths;
  filterIgnored(filePaths: BettererFilePaths): BettererFilePaths;
  sync(): Promise<void>;
};

export type BettererVersionControlWorkerModule = WorkerRequireModule<typeof import('./version-control-worker')>;
export type BettererVersionControlWorker =
  WorkerRequireModuleAsync<BettererVersionControlWorkerModule>['versionControl'];

/**
 * @public A helper object for resolving file paths in a custom {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
 *
 * For ergonomic reasons, a test consumer should be able to use _relative_ paths when they use
 * a test, whether that be passing the path to a config file, or using {@link @betterer/betterer#BettererFileTest.include | `BettererFileTest.include` }
 * to select relevant files.
 *
 * To enable that, **Betterer** creates a `BettererFileResolver` whenever a {@link @betterer/betterer#BettererFileTest | `BettererFileTest` }
 * is run. The `baseDirectory` is set to the directory containing the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
 *
 * Internally **Betterer** uses the `BettererFileResolver` to manage file paths specifed by
 * `.include()` and `.exclude()`. A test function can use the `BettererFileResolver` to
 * resolve and validate file paths.
 *
 * @example
 * ```typescript
 * import { BettererFileTest } from '@betterer/betterer';
 *
 * export function myFileTest (relativeConfigFilePath: string) {
 *   return new BettererFileTest((_, __, resolver) => {
 *     // Resolve a file path relative to the `baseDirectory`
 *     const absoluteConfigFilePath = resolver.resolve(relativeConfigFilePath);
 *
 *     // Validate if some file paths are relevant for a test:
 *     const validatedPaths = resolver.validate(
 *       ['./file-1.js', './file-2.js', './file-3.ts']
 *     );
 *     // ['./file-1.js']
 *   })
 *   .include('**\/*.js')
 *   .exclude(/file-2.js/);
 * };
 * ```
 */
export type BettererFileResolver = {
  /**
   * The direction from which all file paths are resolved.
   */
  readonly baseDirectory: string;
  /**
   * Resolve a file path relative to the `baseDirectory`.
   */
  resolve(...pathSegments: Array<string>): string;
  /**
   * Validate if some file paths are relevant for a test. Files can be included and excluded
   * via {@link @betterer/betterer#BettererFileTest.include | `BettererFileTest.include()`} and {@link @betterer/betterer#BettererFileTest.exclude | `BettererFileTest.exclude()`}.
   */
  validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
};
