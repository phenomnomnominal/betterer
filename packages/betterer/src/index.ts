/**
 * JavaScript API for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).
 *
 * @packageDocumentation
 */

import type { BettererAPI } from './api/index.js';
import { betterer as start, merge, results, runner, watch } from './api/index.js';

const api = start as BettererAPI;
api.merge = merge;
api.results = results;
api.runner = runner;
api.watch = watch;

export const betterer = api;
export { merge, results, runner, watch };

export type { BettererAPI };

export type {
  BettererOptions,
  BettererOptionsStart,
  BettererOptionsResults,
  BettererOptionsWatch
} from './api/public.js';
export type { BettererConfig, BettererOptionsOverride } from './config/public.js';
export type { BettererContext, BettererContextSummary } from './context/public.js';
export type {
  BettererConfigFS,
  BettererConfigMerge,
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
  BettererConfigExcludes,
  BettererConfigFilters,
  BettererConfigIgnores,
  BettererConfigIncludes,
  BettererConfigRunner,
  BettererConfigWatcher,
  BettererOptionsExcludes,
  BettererOptionsFilters,
  BettererOptionsIgnores,
  BettererOptionsIncludes,
  BettererOptionsModeAll,
  BettererOptionsModeCI,
  BettererOptionsModePrecommit,
  BettererOptionsModeStrict,
  BettererOptionsModeUpdate,
  BettererOptionsModeWatch,
  BettererOptionsRunner,
  BettererOptionsRunnerOverride,
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

export { BettererFileTest, BettererTest } from './test/public.js';
