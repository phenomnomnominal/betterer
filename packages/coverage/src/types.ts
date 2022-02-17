import { BettererTest } from '@betterer/betterer';
import * as t from 'io-ts';

const IstanbulCoverageType = t.type({
  total: t.number,
  covered: t.number,
  skipped: t.number,
  pct: t.number
});

const coverageTemplate: Record<BettererCoverageTypes, typeof IstanbulCoverageType> = {
  lines: IstanbulCoverageType,
  statements: IstanbulCoverageType,
  functions: IstanbulCoverageType,
  branches: IstanbulCoverageType
};

export const coverageAttributes = Object.keys(coverageTemplate) as Array<BettererCoverageTypes>;

const IstanbulFileCoverageType = t.type(coverageTemplate);

export const IstanbulCoverageSummaryType = t.union([
  t.type({
    total: IstanbulFileCoverageType
  }),
  t.record(t.string, IstanbulFileCoverageType)
]);

export type IstanbulFileCoverage = t.TypeOf<typeof IstanbulFileCoverageType>;

/**
 * The output format of the istanbul json-summary reporter:
 * https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-reports/lib/json-summary/index.js
 */
export type IstanbulCoverageSummary = t.TypeOf<typeof IstanbulCoverageSummaryType>;

/* Public Types */
/**
 * The kinds of coverage which are collected and reported
 * @public
 */
export type BettererCoverageTypes = 'lines' | 'statements' | 'functions' | 'branches';

/**
 * A record of uncovered lines, statements, functions and branches for a file
 * (or the total project)
 * @public
 */
export type BettererCoverageIssue = Record<BettererCoverageTypes, number>;

/**
 * A record of coverage issues by file (or 'total' for the total project)
 * @public
 */
export type BettererCoverageIssues = Record<string, BettererCoverageIssue>;

/**
 * A record of the change in coverage issues per file (or total).
 * Negative numbers mean the number of uncovered lines/statements/functions/branches
 * went down. A file which is deleted will be assumed to have no issues left.
 * @public
 */
export type BettererCoverageDiff = BettererCoverageIssues;

/**
 * Just an alias for BettererTest
 * @public
 */
export type BettererCoverageTest = BettererTest<BettererCoverageIssues, BettererCoverageIssues, BettererCoverageDiff>;

/**
 * Configure the BettererCoverageTest to your needs
 * @public
 */
export interface BettererCoverageTestOptions<TotalCoverage extends boolean = boolean> {
  /**
   * The location of the coverage file relative to the base directory.
   * Defaults to './coverage/coverage-summary.json'
   */
  coverageFile: string;
  /**
   * The base directory of your project. File paths will be recorded
   * relative to this directory. Defaults to the current working directory.
   */
  baseDir: string;
  /**
   * filter files in the coverage report. Only files whose
   * name (including the path) matches at least one of
   * these expressions are considered. By default, all files
   * are included.
   */
  includeFiles: TotalCoverage extends true ? [] : Array<RegExp>;
  /**
   * filter files in the coverage report. Only files whose
   * name (including the path) matches none of these
   * expressions are considered. By default, there are no filters.
   */
  excludeFiles: TotalCoverage extends true ? [] : Array<RegExp>;
  /**
   * instead of each file, only track the total coverage. In this
   * case, the includeFiles and excludeFiles properties do not do anything.
   * Default: false
   */
  totalCoverage: TotalCoverage;
}
