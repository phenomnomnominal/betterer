import type { BettererRun } from '@betterer/betterer';

import type {
  BettererCoverageIssue,
  BettererCoverageIssues,
  IstanbulCoverage,
  IstanbulCoverageSummary,
  IstanbulFileCoverage
} from './types.js';

import { BettererError } from '@betterer/errors';
import { promises as fs } from 'node:fs';
import minimatch from 'minimatch';
import path from 'node:path';

import { isNumber, normalisedPath } from './utils.js';

export async function test(
  run: BettererRun,
  relativeCoverageSummaryPath: string,
  included: Array<string>,
  excluded: Array<RegExp>
): Promise<BettererCoverageIssues> {
  const baseDirectory = getTestBaseDirectory(run);
  const absoluteCoverageSummaryPath = path.resolve(baseDirectory, relativeCoverageSummaryPath);
  const summary = await readCoverageSummary(absoluteCoverageSummaryPath);
  delete summary.total;
  const uncovered: BettererCoverageIssues = {};
  Object.keys(summary)
    .filter((filePath) => !included.length || included.some((include) => minimatch(filePath, include)))
    .filter((filePath) => !excluded.length || !excluded.some((exclude) => exclude.test(filePath)))
    .forEach((filePath) => {
      const fileCoverage = summary[filePath];
      const relativeFilePath = normalisedPath(path.relative(baseDirectory, filePath));
      uncovered[relativeFilePath] = getUncoveredIssues(fileCoverage);
    });
  return uncovered;
}

export async function testTotal(
  run: BettererRun,
  relativeCoverageSummaryPath: string
): Promise<BettererCoverageIssues> {
  const baseDirectory = getTestBaseDirectory(run);
  const absoluteCoverageSummaryPath = path.resolve(baseDirectory, relativeCoverageSummaryPath);
  const { total } = await readCoverageSummary(absoluteCoverageSummaryPath);
  return {
    total: getUncoveredIssues(total)
  };
}

async function readCoverageSummary(coverageSummaryPath: string): Promise<IstanbulCoverageSummary> {
  const result = await loadCoverageFile(coverageSummaryPath);
  if (result) {
    return result;
  } else {
    throw new BettererError(`Could not read coverage summary`);
  }
}

async function loadCoverageFile(coverageSummaryPath: string): Promise<IstanbulCoverageSummary | null> {
  try {
    const coverageReport = await fs.readFile(coverageSummaryPath, 'utf-8');
    return decodeCoverageSummary(JSON.parse(coverageReport) as IstanbulCoverageSummary);
  } catch (e) {
    return null;
  }
}

function decodeCoverageSummary(data: IstanbulCoverageSummary): IstanbulCoverageSummary | null {
  if (isIstanbulSummary(data) && data.total != null) {
    return data;
  }
  return null;
}

function isIstanbulSummary(data: unknown): data is IstanbulCoverageSummary {
  const maybeSummary = data as IstanbulCoverageSummary;
  return maybeSummary && Object.keys(maybeSummary).every((key) => isFileCoverage(maybeSummary[key]));
}

function isFileCoverage(data: unknown): data is IstanbulFileCoverage {
  const maybeCoverage = data as IstanbulFileCoverage;
  return (
    maybeCoverage &&
    isCoverage(maybeCoverage.branches) &&
    isCoverage(maybeCoverage.functions) &&
    isCoverage(maybeCoverage.lines) &&
    isCoverage(maybeCoverage.statements)
  );
}

function isCoverage(data: unknown): data is IstanbulCoverage {
  const maybeData = data as IstanbulCoverage;
  return (
    maybeData &&
    isNumber(maybeData.covered) &&
    isNumber(maybeData.pct) &&
    isNumber(maybeData.skipped) &&
    isNumber(maybeData.total)
  );
}

function getUncoveredIssues(fileCoverage: IstanbulFileCoverage): BettererCoverageIssue {
  return {
    lines: fileCoverage.lines.total - fileCoverage.lines.covered,
    statements: fileCoverage.statements.total - fileCoverage.statements.covered,
    functions: fileCoverage.functions.total - fileCoverage.functions.covered,
    branches: fileCoverage.branches.total - fileCoverage.branches.covered
  };
}

function getTestBaseDirectory(run: BettererRun): string {
  return path.dirname((run as BettererRunΩ).test.configPath);
}

type BettererRunΩ = BettererRun & {
  test: {
    configPath: string;
  };
};
