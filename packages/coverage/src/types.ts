import type { BettererRun } from '@betterer/betterer';
import type { CoverageSummaryData, Totals } from 'istanbul-lib-coverage';

export type IstanbulCoverage = Totals;
export type IstanbulFileCoverage = CoverageSummaryData;
export type IstanbulCoverageSummary = Record<string, IstanbulFileCoverage> & {
  total: IstanbulFileCoverage;
};

export type BettererCoverageTestFunction = (
  run: BettererRun,
  coverageReportPath: string,
  included: Array<string>,
  excluded: Array<RegExp>
) => Promise<BettererCoverageIssues>;

/**
 * The different types of coverage which are checked
 * @public
 */
export type BettererCoverageTypes = 'lines' | 'statements' | 'functions' | 'branches';

/**
 * The lines, statements, functions and branches coverage for a file (or the total project)
 * @public
 */
export type BettererCoverageIssue = Record<BettererCoverageTypes, number>;

/**
 * The coverage for a project
 * @public
 */
export type BettererCoverageIssues = Record<string, BettererCoverageIssue>;

/**
 * The difference in coverage for a project between two test runs
 * @public
 */
export type BettererCoverageDiff = BettererCoverageIssues;
