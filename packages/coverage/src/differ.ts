import type { BettererDiff } from '@betterer/betterer';
import type { BettererLogs } from '@betterer/logger';
import type { BettererCoverageDiff, BettererCoverageIssue, BettererCoverageIssues } from './types.js';

export function differ(
  expected: BettererCoverageIssues,
  result: BettererCoverageIssues
): BettererDiff<BettererCoverageDiff> {
  const logs: BettererLogs = [];
  const diff: BettererCoverageDiff = {
    ...detectNewOrUpdatedFiles(expected, result, logs),
    ...detectRemovedFiles(expected, result, logs)
  };
  return {
    diff,
    logs
  };
}

function detectNewOrUpdatedFiles(expected: BettererCoverageIssues, result: BettererCoverageIssues, logs: BettererLogs) {
  const diff: BettererCoverageDiff = {};
  Object.entries(result).forEach(([filePath, issue]) => {
    if (expected[filePath]) {
      diff[filePath] = diffFileIssue(expected[filePath], issue, logs, filePath);
    } else {
      logs.push({ debug: `new file: ${filePath}` });
      diff[filePath] = issue;
    }
  });
  return diff;
}

function diffFileIssue(
  expected: BettererCoverageIssue,
  result: BettererCoverageIssue,
  logs: BettererLogs,
  filePath: string
): BettererCoverageIssue {
  const fileDiff: BettererCoverageIssue = {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0
  };
  const coverageTypes = Object.keys(fileDiff) as Array<keyof BettererCoverageIssue>;
  coverageTypes.forEach((attribute: keyof BettererCoverageIssue) => {
    const resultValue = result[attribute];
    const expectedValue = expected[attribute];
    const delta = resultValue - expectedValue;
    if (delta < 0) {
      logs.push({
        debug: `"${attribute}" coverage is better in "${filePath}": ${String(result[attribute])} < ${String(expected[attribute])}`
      });
    } else if (delta > 0) {
      logs.push({
        error: `"${attribute}" coverage is worse in "${filePath}": ${String(result[attribute])} > ${String(expected[attribute])}`
      });
    }
    fileDiff[attribute] = delta;
  });
  return fileDiff;
}

function detectRemovedFiles(expected: BettererCoverageIssues, result: BettererCoverageIssues, logs: BettererLogs) {
  const diff: BettererCoverageDiff = {};
  Object.entries(expected).forEach(([expectedFile, issues]) => {
    if (!result[expectedFile]) {
      logs.push({ debug: `${expectedFile} is gone.` });
      diff[expectedFile] = getNegativeIssue(issues);
    }
  });
  return diff;
}

function getNegativeIssue(issue: BettererCoverageIssue): BettererCoverageIssue {
  return {
    branches: -issue.branches,
    lines: -issue.lines,
    functions: -issue.functions,
    statements: -issue.statements
  };
}
