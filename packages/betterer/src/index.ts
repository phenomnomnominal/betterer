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
} from './api/index.js';
export type { BettererConfig, BettererOptionsOverride } from './config/index.js';
export type {
  BettererConfigContext,
  BettererConfigExcludes,
  BettererConfigFilters,
  BettererConfigIncludes,
  BettererContext,
  BettererContextSummary,
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
  BettererOptionsModeWatch
} from './context/index.js';
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
} from './fs/index.js';
export type {
  BettererConfigReporter,
  BettererOptionsReporter,
  BettererOptionsReporterOverride,
  BettererOptionsReporters,
  BettererReporter
} from './reporters/index.js';
export type {
  BettererFileTestResultSummary,
  BettererFileTestResultSummaryDetails,
  BettererResult,
  BettererResultSummaries,
  BettererResultSummary,
  BettererResultsSummary,
  BettererTestResultSummary,
  BettererTestResultSummaryDetails
} from './results/index.js';
export type {
  BettererDelta,
  BettererRun,
  BettererRunSummaries,
  BettererRunSummary,
  BettererRuns
} from './run/index.js';
export type {
  BettererConfigIgnores,
  BettererConfigWatcher,
  BettererOptionsIgnores,
  BettererOptionsWatcher,
  BettererOptionsWatcherOverride,
  BettererRunner
} from './runner/index.js';
export type { BettererSuite, BettererSuiteSummaries, BettererSuiteSummary } from './suite/index.js';
export type {
  BettererDeserialise,
  BettererDiff,
  BettererDiffer,
  BettererFile,
  BettererFileBase,
  BettererFileDiff,
  BettererFileIssue,
  BettererFileIssueSerialised,
  BettererFileIssues,
  BettererFileIssuesSerialised,
  BettererFileTestDiff,
  BettererFileTestFunction,
  BettererFileTestResult,
  BettererFileTestResultKey,
  BettererFileTestResultSerialised,
  BettererFilesDiff,
  BettererPrinter,
  BettererProgress,
  BettererSerialise,
  BettererSerialiser,
  BettererTestConfig,
  BettererTestConstraint,
  BettererTestDeadline,
  BettererTestFunction,
  BettererTestGoal,
  BettererTestNames,
  BettererTestOptions
} from './test/index.js';
export type { MaybeAsync } from './types.js';

export { betterer, merge, results, runner, watch } from './api/index.js';
export { BettererFileTest, BettererResolverTest, BettererTest } from './test/index.js';
