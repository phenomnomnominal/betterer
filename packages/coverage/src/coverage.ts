import path from 'path';
import fs from 'fs';
import {
  BettererDiff,
  BettererRun,
  BettererSerialiser,
  BettererTest,
  BettererTestOptionsComplex
} from '@betterer/betterer';
import { BettererConstraintResult } from '@betterer/constraints';
import { BettererLog, BettererLogs } from '@betterer/logger';
import {
  BettererCoverageDiff,
  BettererCoverageIssue,
  BettererCoverageIssues,
  BettererCoverageTest,
  BettererCoverageTestOptions,
  coverageAttributes,
  IstanbulCoverageSummary,
  IstanbulCoverageSummaryType,
  IstanbulFileCoverage
} from './types';
import { reduceJoinRecords, uncoveredFile } from './helpers';
import { isRight } from 'fp-ts/Either';
import { BettererError } from '@betterer/errors';
import { Validation } from 'io-ts';

class BettererCoverageTestΩ
  implements BettererTestOptionsComplex<BettererCoverageIssues, BettererCoverageIssues, BettererCoverageDiff>
{
  private readonly excludes: Array<RegExp>;
  private readonly includes: Array<RegExp>;
  private readonly coverageReportPath: string;
  private readonly baseDir: string;
  private readonly onlyTotalCoverage: boolean;

  constructor(options: BettererCoverageTestOptions) {
    this.baseDir = path.resolve(options.baseDir);
    this.coverageReportPath = path.resolve(this.baseDir, options.coverageFile);
    this.excludes = options.excludeFiles;
    this.includes = options.includeFiles;
    this.onlyTotalCoverage = options.totalCoverage;
  }

  public differ(
    expectedIssues: BettererCoverageIssues,
    actualIssues: BettererCoverageIssues
  ): BettererDiff<BettererCoverageDiff> {
    const logs: BettererLogs = [];
    const diff: BettererCoverageDiff = {};
    if (Object.keys(actualIssues).length === 0) {
      logs.push({ warn: 'The result is empty. Have you maybe forgotten to run your tests?' });
    } else {
      Object.keys(actualIssues).forEach((filePath) => {
        const issue = actualIssues[filePath];
        const expected = expectedIssues[filePath];
        if (!expected) {
          logs.push({ debug: `new file: ${filePath}` });
          diff[filePath] = issue;
        } else {
          diff[filePath] = this.diffFileIssue(issue, expected, logs, filePath);
        }
      });
    }
    Object.keys(expectedIssues).forEach((expectedFile) => {
      if (!actualIssues[expectedFile]) {
        logs.push({ debug: `${expectedFile} is gone.` });
        diff[expectedFile] = coverageAttributes
          .map((attribute) => ({ [attribute]: -expectedIssues[expectedFile][attribute] }))
          .reduce(reduceJoinRecords, {}) as BettererCoverageIssue;
      }
    });
    return {
      diff,
      logs
    };
  }

  public constraint(
    actualIssues: BettererCoverageIssues,
    expectedIssues: BettererCoverageIssues
  ): BettererConstraintResult {
    const { diff } = this.differ(expectedIssues, actualIssues);
    let hasImproved = false;
    for (const filePath of Object.keys(diff)) {
      for (const attribute of coverageAttributes) {
        const delta = diff[filePath][attribute];
        if (delta > 0) {
          return BettererConstraintResult.worse;
        }
        if (delta < 0) {
          hasImproved = true;
        }
      }
    }
    if (hasImproved) {
      return BettererConstraintResult.better;
    }
    return BettererConstraintResult.same;
  }

  public goal(result: BettererCoverageIssues): boolean {
    return Object.keys(result).every((filePath) =>
      coverageAttributes.every((attribute) => result[filePath][attribute] === 0)
    );
  }

  public get serialiser(): BettererSerialiser<BettererCoverageIssues, BettererCoverageIssues> {
    return {
      serialise: (f) => f,
      deserialise: (f) => f
    };
  }

  public test(run: BettererRun): BettererCoverageIssues {
    const { total, ...fileReports } = this.getCoverageSummary(run);
    if (this.onlyTotalCoverage) {
      return this.getUncoveredIssues(total, 'total');
    }
    return Object.keys(fileReports)
      .filter((filePath) => this.includes.some((includeExpr) => includeExpr.test(filePath)))
      .filter((filePath) => !this.excludes.some((excludeExpr) => excludeExpr.test(filePath)))
      .map((filePath) => {
        const fileCoverage = (fileReports as Record<string, IstanbulFileCoverage>)[filePath];
        const relativePath = path.relative(this.baseDir, filePath);
        return this.getUncoveredIssues(fileCoverage, relativePath);
      })
      .reduce(reduceJoinRecords, {});
  }

  private getUncoveredIssues(fileCoverage: IstanbulFileCoverage, filePath: string) {
    const fileReport: BettererCoverageIssue = {
      ...uncoveredFile
    };
    coverageAttributes.forEach((attribute) => {
      fileReport[attribute] = fileCoverage[attribute].total - fileCoverage[attribute].covered;
    });
    return {
      [filePath]: fileReport
    };
  }

  private getCoverageSummary(run: BettererRun): IstanbulCoverageSummary {
    const result = this.loadCoverageFile();
    if (isRight(result)) {
      return result.right;
    } else {
      throw new BettererError(`${run.name} could not decode coverage file`);
    }
  }

  private loadCoverageFile(): Validation<IstanbulCoverageSummary> {
    try {
      return IstanbulCoverageSummaryType.decode(JSON.parse(fs.readFileSync(this.coverageReportPath) as never));
    } catch (e) {
      throw new BettererError(`Could not find or open file ${this.coverageReportPath}`);
    }
  }

  private diffFileIssue(
    issue: BettererCoverageIssue,
    expected: BettererCoverageIssue,
    logs: Array<BettererLog>,
    filePath: string
  ): BettererCoverageIssue {
    const fileDiff: BettererCoverageIssue = {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    };
    coverageAttributes.forEach((attribute) => {
      const delta = issue[attribute] - expected[attribute];
      if (delta < 0) {
        logs.push({
          debug: `${attribute} is better in ${filePath}: ${issue[attribute]} < ${expected[attribute]}`
        });
      } else if (delta > 0) {
        logs.push({
          error: `${attribute} is worse in ${filePath}: ${issue[attribute]} > ${expected[attribute]}`
        });
      }
      fileDiff[attribute] = delta;
    });
    return fileDiff;
  }
}

function getWrapped(
  coverageTest: BettererCoverageTestΩ
): BettererTestOptionsComplex<BettererCoverageIssues, BettererCoverageIssues, BettererCoverageDiff> {
  return {
    test: (...args) => coverageTest.test(...args),
    constraint: (...args) => coverageTest.constraint(...args),
    differ: (...args) => coverageTest.differ(...args),
    goal: (...args) => coverageTest.goal(...args),
    serialiser: coverageTest.serialiser
  };
}

/**
 * @param options - configuration for the coverage test
 *
 * @public
 */
export function coverage<TotalCoverage extends boolean>(
  options: Partial<BettererCoverageTestOptions<TotalCoverage>> = {}
): BettererCoverageTest {
  const defaultTestOptions: BettererCoverageTestOptions = {
    baseDir: './',
    coverageFile: './coverage/coverage-summary.json',
    includeFiles: [/.*/],
    excludeFiles: [],
    totalCoverage: false
  };
  const coverageTest = new BettererCoverageTestΩ({
    ...defaultTestOptions,
    ...options
  });
  return new BettererTest<BettererCoverageIssues, BettererCoverageIssues, BettererCoverageDiff>(
    getWrapped(coverageTest)
  );
}
