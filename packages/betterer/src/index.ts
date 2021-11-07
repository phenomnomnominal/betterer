/**
 * {@link https://www.npmjs.com/package/@betterer/betterer | `@betterer/betterer` }
 *
 * JavaScript API for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).
 *
 * @packageDocumentation
 */

export { betterer, merge, results, runner, watch } from './betterer';
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
} from './config/public';
export { BettererContext, BettererContextSummary } from './context/public';
export {
  BettererFileGlobs,
  BettererFilePath,
  BettererFilePaths,
  BettererFilePatterns,
  BettererFileResolver
} from './fs/public';
export { BettererReporter } from './reporters/public';
export {
  BettererFileTestResultSummaryDetails,
  BettererTestResultSummaryDetails,
  BettererResult,
  BettererResultsSummary,
  BettererTestResultSummaries,
  BettererTestResultSummary
} from './results/public';
export { BettererDelta, BettererRun, BettererRuns, BettererRunSummary, BettererRunSummaries } from './run/public';
export { BettererRunner } from './runner/public';
export { BettererSuite, BettererSuiteSummary, BettererSuiteSummaries } from './suite/public';
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
} from './test/public';
