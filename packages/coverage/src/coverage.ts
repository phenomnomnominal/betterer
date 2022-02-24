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
  decodeCoverageSummary,
  isSome,
  IstanbulCoverageAspects,
  IstanbulCoverageSummary,
  IstanbulFileCoverage,
  Maybe
} from './types';
import { reduceJoinRecords, uncoveredFile } from './helpers';
import { BettererError } from '@betterer/errors';

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
      Object.assign(diff, this.detectNewOrUpdatedFiles(actualIssues, expectedIssues, logs));
    }
    Object.assign(diff, this.detectRemovedFiles(expectedIssues, actualIssues, logs));
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
    const { isWorse, isImproved } = this.isWorseOrImproved(diff);
    if (isWorse) {
      return BettererConstraintResult.worse;
    }
    if (isImproved) {
      return BettererConstraintResult.better;
    }
    return BettererConstraintResult.same;
  }

  public goal(result: BettererCoverageIssues): boolean {
    return Object.keys(result).every((filePath) =>
      IstanbulCoverageAspects.every((attribute) => result[filePath][attribute] === 0)
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
      return this.getTotalIssues(total);
    }
    return this.getAllUncoveredFileIssues(fileReports as Record<string, IstanbulFileCoverage>);
  }

  private getUncoveredIssues(fileCoverage: IstanbulFileCoverage, filePath: string) {
    const fileReport: BettererCoverageIssue = {
      ...uncoveredFile
    };
    IstanbulCoverageAspects.forEach((attribute) => {
      fileReport[attribute] = fileCoverage[attribute].total - fileCoverage[attribute].covered;
    });
    return {
      [filePath]: fileReport
    };
  }

  private getTotalIssues(total: IstanbulFileCoverage) {
    return this.getUncoveredIssues(total, 'total');
  }

  private getAllUncoveredFileIssues(fileReports: Record<string, IstanbulFileCoverage>): BettererCoverageIssues {
    return Object.keys(fileReports)
      .filter((filePath) => this.includes.some((includeExpr) => includeExpr.test(filePath)))
      .filter((filePath) => !this.excludes.some((excludeExpr) => excludeExpr.test(filePath)))
      .map((filePath) => ({ relativeFilePath: path.relative(this.baseDir, filePath), absoluteFilePath: filePath }))
      .map(({ relativeFilePath, absoluteFilePath }) => {
        const fileCoverage = fileReports[absoluteFilePath];
        return this.getUncoveredIssues(fileCoverage, relativeFilePath);
      })
      .reduce(reduceJoinRecords, {});
  }

  private getCoverageSummary(run: BettererRun): IstanbulCoverageSummary {
    const result = this.loadCoverageFile();
    if (isSome(result)) {
      return result.value;
    } else {
      throw new BettererError(`${run.name} could not decode coverage file`);
    }
  }

  private loadCoverageFile(): Maybe<IstanbulCoverageSummary> {
    try {
      return decodeCoverageSummary(JSON.parse(fs.readFileSync(this.coverageReportPath) as never));
    } catch (e) {
      throw new BettererError(`Could not find or open file ${this.coverageReportPath}`);
    }
  }

  private diffFileIssue(
    actualIssue: BettererCoverageIssue,
    expectedIssue: BettererCoverageIssue,
    logs: Array<BettererLog>,
    filePath: string
  ): BettererCoverageIssue {
    const fileDiff: BettererCoverageIssue = {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    };
    IstanbulCoverageAspects.forEach((attribute) => {
      const delta = actualIssue[attribute] - expectedIssue[attribute];
      if (delta < 0) {
        logs.push({
          debug: `${attribute} is better in ${filePath}: ${actualIssue[attribute]} < ${expectedIssue[attribute]}`
        });
      } else if (delta > 0) {
        logs.push({
          error: `${attribute} is worse in ${filePath}: ${actualIssue[attribute]} > ${expectedIssue[attribute]}`
        });
      }
      fileDiff[attribute] = delta;
    });
    return fileDiff;
  }

  private detectRemovedFiles(
    expectedIssues: BettererCoverageIssues,
    actualIssues: BettererCoverageIssues,
    logs: Array<BettererLog>
  ) {
    const diff: BettererCoverageDiff = {};
    Object.keys(expectedIssues).forEach((expectedFile) => {
      if (!actualIssues[expectedFile]) {
        logs.push({ debug: `${expectedFile} is gone.` });
        diff[expectedFile] = this.getNegativeIssue(expectedIssues[expectedFile]);
      }
    });
    return diff;
  }

  private getNegativeIssue(expectedIssue: BettererCoverageIssue) {
    return IstanbulCoverageAspects.map((attribute) => ({ [attribute]: -expectedIssue[attribute] })).reduce(
      reduceJoinRecords,
      {}
    ) as BettererCoverageIssue;
  }

  private detectNewOrUpdatedFiles(
    actualIssues: BettererCoverageIssues,
    expectedIssues: BettererCoverageIssues,
    logs: Array<BettererLog>
  ) {
    const diff: BettererCoverageDiff = {};
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
    return diff;
  }

  private isWorseOrImproved(diff: BettererCoverageDiff): { isWorse: boolean; isImproved: boolean } {
    const result = {
      isWorse: false,
      isImproved: false
    };
    for (const filePath of Object.keys(diff)) {
      for (const attribute of IstanbulCoverageAspects) {
        const delta = diff[filePath][attribute];
        if (delta > 0) {
          return {
            isWorse: true,
            isImproved: false
          };
        }
        if (delta < 0) {
          result.isImproved = true;
        }
      }
    }
    return result;
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
