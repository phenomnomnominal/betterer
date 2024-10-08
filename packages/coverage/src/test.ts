import type {
  BettererCoverageIssue,
  BettererCoverageIssues,
  IstanbulCoverage,
  IstanbulCoverageSummary,
  IstanbulFileCoverage
} from './types.js';

import type { BettererFileResolver } from '@betterer/betterer';
import { BettererError, invariantΔ } from '@betterer/errors';
import { promises as fs } from 'node:fs';

export async function test(
  relativeCoverageSummaryPath: string,
  resolver: BettererFileResolver
): Promise<BettererCoverageIssues> {
  const absoluteCoverageSummaryPath = resolver.resolve(relativeCoverageSummaryPath);
  const summary = await readCoverageSummary(absoluteCoverageSummaryPath);

  const absoluteFilePaths = Object.keys(summary).filter((key) => key !== 'total');
  let includedAbsoluteFilePaths = resolver.included(absoluteFilePaths);

  // If no files have been included, check everything:
  if (includedAbsoluteFilePaths.length === 0) {
    includedAbsoluteFilePaths = absoluteFilePaths;
  }

  const uncovered: BettererCoverageIssues = {};
  includedAbsoluteFilePaths.map((filePath) => {
    const includedRelativeFilePath = resolver.relative(filePath);
    const fileCoverage = summary[filePath];
    invariantΔ(fileCoverage, `\`filePath\` should be a valid key of \`summary\`!`, summary, filePath);
    uncovered[includedRelativeFilePath] = getUncoveredIssues(fileCoverage);
  });

  return uncovered;
}

export async function testTotal(
  relativeCoverageSummaryPath: string,
  resolver: BettererFileResolver
): Promise<BettererCoverageIssues> {
  const uncovered = await test(relativeCoverageSummaryPath, resolver);

  const total: BettererCoverageIssue = {
    lines: 0,
    statements: 0,
    functions: 0,
    branches: 0
  };
  Object.values(uncovered).forEach((fileCoverage) => {
    total.branches += fileCoverage.branches;
    total.functions += fileCoverage.functions;
    total.lines += fileCoverage.lines;
    total.statements += fileCoverage.statements;
  });
  return { total };
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

function isNumber(input: unknown): input is number {
  return typeof input === 'number';
}

function getUncoveredIssues(fileCoverage: IstanbulFileCoverage): BettererCoverageIssue {
  return {
    lines: fileCoverage.lines.total - fileCoverage.lines.covered,
    statements: fileCoverage.statements.total - fileCoverage.statements.covered,
    functions: fileCoverage.functions.total - fileCoverage.functions.covered,
    branches: fileCoverage.branches.total - fileCoverage.branches.covered
  };
}
