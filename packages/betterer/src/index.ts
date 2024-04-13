/**
 * JavaScript API for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).
 *
 * @packageDocumentation
 */

export type {
  BettererAPI,
  BettererOptions,
  BettererOptionsResults,
  BettererOptionsRunner,
  BettererOptionsWatch
} from './api/public.js';
export type { BettererConfig, BettererOptionsOverride } from './config/public.js';
export type {
  BettererContext,
  BettererContextSummary,
  BettererConfigExcludes,
  BettererConfigFilters,
  BettererConfigIncludes,
  BettererOptionsContext,
  BettererOptionsContextOverride,
  BettererOptionsExcludes,
  BettererOptionsFilters,
  BettererOptionsIncludes,
  BettererOptionsMode,
  BettererOptionsModeCI,
  BettererOptionsModeDefault,
  BettererOptionsModePrecommit,
  BettererOptionsModeStrict,
  BettererOptionsModeUpdate,
  BettererOptionsModeWatch,
  BettererConfigContext
} from './context/public.js';
export type {
  BettererConfigFS,
  BettererConfigPaths,
  BettererFileGlobs,
  BettererFilePath,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver,
  BettererOptionsFS,
  BettererOptionsMerge,
  BettererOptionsPaths
} from './fs/public.js';
export type {
  BettererConfigReporter,
  BettererOptionsReporter,
  BettererOptionsReporterOverride,
  BettererOptionsReporters,
  BettererReporter
} from './reporters/public.js';
export type {
  BettererFileTestResultSummary,
  BettererFileTestResultSummaryDetails,
  BettererTestResultSummary,
  BettererTestResultSummaryDetails,
  BettererResult,
  BettererResultSummary,
  BettererResultSummaries,
  BettererResultsSummary
} from './results/public.js';
export type {
  BettererDelta,
  BettererRun,
  BettererRuns,
  BettererRunSummary,
  BettererRunSummaries
} from './run/public.js';
export type {
  BettererConfigIgnores,
  BettererConfigWatcher,
  BettererOptionsIgnores,
  BettererOptionsWatcher,
  BettererOptionsWatcherOverride,
  BettererRunner
} from './runner/public.js';
export type { BettererSuite, BettererSuiteSummary, BettererSuiteSummaries } from './suite/public.js';
export type {
  BettererDeserialise,
  BettererDiff,
  BettererDiffer,
  BettererFile,
  BettererFileBase,
  BettererFileDiff,
  BettererFilesDiff,
  BettererFileTestFunction,
  BettererFileTestResult,
  BettererFileTestResultSerialised,
  BettererFileTestDiff,
  BettererFileIssue,
  BettererFileIssueSerialised,
  BettererFileIssues,
  BettererFileIssuesSerialised,
  BettererPrinter,
  BettererProgress,
  BettererSerialise,
  BettererSerialiser,
  BettererTestBase,
  BettererTestConstraint,
  BettererTestDeadline,
  BettererTestFunction,
  BettererTestGoal,
  BettererTestConfig,
  BettererTestOptions,
  BettererTestOptionsBasic,
  BettererTestOptionsComplex,
  BettererTestNames
} from './test/public.js';
export type { BettererConfigTypeScript, BettererOptionsTypeScript } from './typescript/public.js';
export type { MaybeAsync } from './types.js';

export { betterer, merge, results, runner, watch } from './api/index.js';
export { BettererFileTest, BettererTest } from './test/public.js';
