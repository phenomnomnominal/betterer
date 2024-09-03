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
  const uncovered: BettererCoverageIssues = {};
  Object.entries(summary)
    .filter(([key]) => key !== 'total')
    .filter(([filePath]) => !included.length || included.some((include) => minimatch(filePath, include)))
    .filter(([filePath]) => !excluded.length || !excluded.some((exclude) => exclude.test(filePath)))
    .forEach(([filePath, fileCoverage]) => {
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
    return decodeCoverageSummary(JSON.parse(coverageReport));
  } catch {
    return null;
  }
}

function decodeCoverageSummary(data: unknown): IstanbulCoverageSummary | null {
  return isIstanbulSummary(data) ? data : null;
}

function isIstanbulSummary(data: unknown): data is IstanbulCoverageSummary {
  if (!data) {
    return false;
  }
  const maybeIstanbulSummary = data as Partial<IstanbulCoverageSummary>;
  return (
    Object.keys(maybeIstanbulSummary).every((key) => isFileCoverage(maybeIstanbulSummary[key])) &&
    maybeIstanbulSummary.total != null
  );
}

function isFileCoverage(data: unknown): data is IstanbulFileCoverage {
  if (!data) {
    return false;
  }
  const maybeFileCoverage = data as Partial<IstanbulFileCoverage>;
  return (
    isCoverage(maybeFileCoverage.branches) &&
    isCoverage(maybeFileCoverage.functions) &&
    isCoverage(maybeFileCoverage.lines) &&
    isCoverage(maybeFileCoverage.statements)
  );
}

function isCoverage(data: unknown): data is IstanbulCoverage {
  if (!data) {
    return false;
  }
  const maybeData = data as Partial<IstanbulCoverage>;
  return (
    isNumber(maybeData.covered) && isNumber(maybeData.pct) && isNumber(maybeData.skipped) && isNumber(maybeData.total)
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
