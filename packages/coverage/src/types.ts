import { BettererTest } from '@betterer/betterer';

const IstanbulCoverageTemplate = {
  total: 0,
  covered: 0,
  skipped: 0,
  pct: 0
};

type IstanbulCoverage = typeof IstanbulCoverageTemplate;

const IstanbulFileCoverageTemplate: Record<BettererCoverageTypes, IstanbulCoverage> = {
  lines: IstanbulCoverageTemplate,
  statements: IstanbulCoverageTemplate,
  functions: IstanbulCoverageTemplate,
  branches: IstanbulCoverageTemplate
};

export const IstanbulCoverageAspects = Object.keys(IstanbulFileCoverageTemplate) as Array<BettererCoverageTypes>;

export type IstanbulFileCoverage = typeof IstanbulFileCoverageTemplate;

/**
 * The output format of the istanbul json-summary reporter:
 * https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-reports/lib/json-summary/index.js
 */
export type IstanbulCoverageSummary = Record<'total', IstanbulFileCoverage> & Record<string, IstanbulFileCoverage>;

interface Some<Type> {
  value: Type;
}

interface Unknown {
  unknown: unknown;
}

function asUnknown(data: unknown): Unknown {
  return {
    unknown: data
  };
}

export type Maybe<Type> = Some<Type> | Unknown;

function hasOwn<P extends string>(object: unknown, prop: P): object is Record<P, unknown> {
  return Object.hasOwnProperty.call(object, prop);
}

export function isSome<Type>(maybe: Maybe<Type>): maybe is Some<Type> {
  return hasOwn(maybe, 'value');
}

function isObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && data !== undefined;
}

function isCoverage(data: unknown): data is IstanbulCoverage {
  if (!isObject(data)) {
    return false;
  }
  return Object.keys(IstanbulCoverageTemplate).every(
    (attribute) => hasOwn(data, attribute) && typeof data[attribute] === 'number'
  );
}

function isFileCoverage(data: unknown): data is IstanbulFileCoverage {
  if (!isObject(data)) {
    return false;
  }
  return Object.keys(IstanbulFileCoverageTemplate).every((aspect) => hasOwn(data, aspect) && isCoverage(data[aspect]));
}

function isIstanbulSummary(data: Record<string, unknown>): data is Record<string, IstanbulFileCoverage> {
  return Object.keys(data).every((key) => {
    return isFileCoverage(data[key]);
  });
}

export function decodeCoverageSummary(data: IstanbulCoverageSummary | unknown): Maybe<IstanbulCoverageSummary> {
  if (!isObject(data)) {
    return asUnknown(data);
  }
  const allValid = isIstanbulSummary(data);
  const hasTotalCoverage = hasOwn(data, 'total');
  if (allValid && hasTotalCoverage) {
    return {
      value: data
    };
  }
  return asUnknown(data);
}

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
