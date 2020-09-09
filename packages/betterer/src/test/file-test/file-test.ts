import { BettererRun } from '../../context';
import { createTestConfig } from '../config';
import { BettererTestState } from '../test-state';
import { BettererTestFunction } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFileResolver } from './file-resolver';
import { BettererFileTestResultΩ } from './file-test-result';
import { goal } from './goal';
import { printer } from './printer';
import { deserialise, serialise } from './serialiser';
import { BettererFileGlobs, BettererFilePatterns, BettererFileTestFunction, BettererFileTestResult } from './types';

const IS_BETTERER_FILE_TEST = 'isBettererFileTest';

export class BettererFileTest extends BettererTestState {
  public readonly isBettererFileTest = IS_BETTERER_FILE_TEST;

  constructor(private _resolver: BettererFileResolver, fileTest: BettererFileTestFunction) {
    super(
      createTestConfig({
        test: createTest(_resolver, fileTest),
        constraint,
        goal,

        serialiser: { deserialise, serialise },
        differ,
        printer
      })
    );
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolver.excludeΔ(...excludePatterns);
    return this;
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._resolver.includeΔ(...includePatterns);
    return this;
  }
}

function createTest(
  resolver: BettererFileResolver,
  fileTest: BettererFileTestFunction
): BettererTestFunction<BettererFileTestResult> {
  return async (run: BettererRun): Promise<BettererFileTestResult> => {
    const { filePaths } = run;

    const expectedΩ = run.expected.value as BettererFileTestResultΩ;
    const relevantFilePaths = await resolver.files(filePaths);
    const files = new BettererFileTestResultΩ(resolver);
    await fileTest(relevantFilePaths, files);

    if (filePaths.length && !run.isNew) {
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

export function isBettererFileTest(test: unknown): test is BettererFileTest {
  return (test as BettererFileTest)?.isBettererFileTest === IS_BETTERER_FILE_TEST;
}
