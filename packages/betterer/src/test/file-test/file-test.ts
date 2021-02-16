import { BettererRun } from '../../context';
import { createTestConfig } from '../config';
import { BettererTestType } from '../type';
import { BettererTestBase, BettererTestConfig, BettererTestFunction } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFileResolver } from './file-resolver';
import { BettererFileTestResultΩ } from './file-test-result';
import { goal } from './goal';
import { printer } from './printer';
import { deserialise, serialise } from './serialiser';
import {
  BettererFileGlobs,
  BettererFileIssuesMapSerialised,
  BettererFilePatterns,
  BettererFilesDiff,
  BettererFileTestFunction,
  BettererFileTestResult
} from './types';

export class BettererFileTest
  implements BettererTestBase<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff> {
  private _config: BettererTestConfig<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff>;
  private _isOnly = false;
  private _isSkipped = false;

  constructor(private _resolver: BettererFileResolver, fileTest: BettererFileTestFunction) {
    this._config = createTestConfig(
      {
        test: createTest(_resolver, fileTest),
        constraint,
        goal,
        serialiser: { deserialise, serialise },
        differ,
        printer
      },
      BettererTestType.File
    ) as BettererTestConfig<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff>;
  }

  public get config(): BettererTestConfig<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff> {
    return this._config;
  }

  public get isOnly(): boolean {
    return this._isOnly;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolver.excludeΔ(...excludePatterns);
    return this;
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._resolver.includeΔ(...includePatterns);
    return this;
  }

  public only(): this {
    this._isOnly = true;
    return this;
  }

  public skip(): this {
    this._isSkipped = true;
    return this;
  }
}

function createTest(
  resolver: BettererFileResolver,
  fileTest: BettererFileTestFunction
): BettererTestFunction<BettererFileTestResult> {
  return async (run: BettererRun): Promise<BettererFileTestResult> => {
    const { filePaths } = run;

    const relevantFilePaths = await resolver.files(filePaths);
    const files = new BettererFileTestResultΩ(resolver);
    await fileTest(relevantFilePaths, files);

    if (filePaths.length && !run.isNew) {
      const expectedΩ = run.expected.value as BettererFileTestResultΩ;

      // Get any filePaths that have expected issues but weren't included in this run:
      const excludedFilesWithIssues = expectedΩ.files
        .map((file) => file.absolutePath)
        .filter((filePath) => !filePaths.includes(filePath));

      // Filter them based on the current resolver:
      const relevantExcludedFilePaths = await resolver.validate(excludedFilesWithIssues);

      // Add the existing issues to the new result:
      relevantExcludedFilePaths.forEach((filePath) => {
        files.addExpected(expectedΩ.getFile(filePath));
      });
    }
    return files;
  };
}
