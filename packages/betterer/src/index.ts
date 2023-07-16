/**
 * JavaScript API for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).
 *
 * @packageDocumentation
 */

export { betterer, merge, results, runner, watch } from './betterer.js';
export {
  BettererConfig,
  BettererConfigBase,
  BettererConfigStart,
  BettererConfigWatch,
  BettererConfigExcludes,
  BettererConfigFilters,
  BettererConfigIgnores,
  BettererConfigIncludes,
  BettererConfigPaths,
  BettererOptionsBase,
  BettererOptionsExcludes,
  BettererOptionsFilters,
  BettererOptionsIgnores,
  BettererOptionsIncludes,
  BettererOptionsMerge,
  BettererOptionsOverride,
  BettererOptionsPaths,
  BettererOptionsReporters,
  BettererOptionsResults,
  BettererOptionsRunner,
  BettererOptionsStartBase,
  BettererOptionsStartCI,
  BettererOptionsStartDefault,
  BettererOptionsStartPrecommit,
  BettererOptionsStartStrict,
  BettererOptionsStartUpdate,
  BettererOptionsStart,
  BettererOptionsWatch
} from './config/public.js';
export { BettererContext, BettererContextSummary } from './context/public.js';
export {
  BettererFileGlobs,
  BettererFilePath,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver
} from './fs/public.js';
export { BettererReporter } from './reporters/public.js';
export {
  BettererFileTestResultSummary,
  BettererFileTestResultSummaryDetails,
  BettererTestResultSummary,
  BettererTestResultSummaryDetails,
  BettererResult,
  BettererResultSummary,
  BettererResultSummaries,
  BettererResultsSummary
} from './results/public.js';
export { BettererDelta, BettererRun, BettererRuns, BettererRunSummary, BettererRunSummaries } from './run/public.js';
export { BettererRunner } from './runner/public.js';
export { BettererSuite, BettererSuiteSummary, BettererSuiteSummaries } from './suite/public.js';
export {
  BettererDeserialise,
  BettererDiff,
  BettererDiffer,
  BettererFile,
  BettererFileBase,
  BettererFileDiff,
  BettererFilesDiff,
  BettererFileTest,
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
  BettererTest,
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
