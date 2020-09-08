import { BettererRun } from '../../context';
import { BettererTest } from '../test';
import { BettererTestFunction } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFileResolver } from './file-resolver';
import { BettererFilesΩ } from './files';
import { goal } from './goal';
import { printer } from './printer';
import { deserialise, serialise } from './serialiser';
import {
  BettererFileGlobs,
  BettererFileIssuesMapSerialised,
  BettererFilePatterns,
  BettererFileTestDiff,
  BettererFileTestFunction,
  BettererFiles
} from './types';

const IS_BETTERER_FILE_TEST = 'isBettererFileTest';

export class BettererFileTest extends BettererTest<
  BettererFiles,
  BettererFileIssuesMapSerialised,
  BettererFileTestDiff
> {
  public readonly isBettererFileTest = IS_BETTERER_FILE_TEST;

  private _test: BettererTestFunction<BettererFiles> | null = null;

  constructor(private _resolver: BettererFileResolver, fileTest: BettererFileTestFunction) {
    super({
      test: async (run: BettererRun): Promise<BettererFiles> => {
        this._test = this._test || this._createTest(fileTest);
        return await this._test(run);
      },
      constraint,
      goal,

      serialiser: {
        deserialise,
        serialise
      },
      differ,
      printer
    });
  }

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolver.excludeΔ(...excludePatterns);
    return this;
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._resolver.includeΔ(...includePatterns);
    return this;
  }

  private _createTest(fileTest: BettererFileTestFunction): BettererTestFunction<BettererFiles> {
    return async (run: BettererRun): Promise<BettererFiles> => {
      const { filePaths } = run;

      const expectedΩ = run.expected.value as BettererFilesΩ;
      const relevantFilePaths = await this._resolver.files(filePaths);
      const files = new BettererFilesΩ();
      await fileTest(relevantFilePaths, files);

      if (filePaths.length && !run.isNew) {
        // Get any filePaths that have expected issues but weren't included in this run:
        const excludedFilesWithIssues = expectedΩ.files
          .map((file) => file.absolutePath)
          .filter((filePath) => !filePaths.includes(filePath));

        // Filter them based on the current resolver:
        const relevantExcludedFilePaths = await this._resolver.validate(excludedFilesWithIssues);

        // Add the existing issues to the new result:
        relevantExcludedFilePaths.forEach((filePath) => {
          const expectedFile = expectedΩ.getFile(filePath);
          const file = files.addFileHash(filePath, expectedFile.hash);
          file.addIssues(expectedFile.issues);
        });
      }
      return files;
    };
  }
}

export function isBettererFileTest(test: unknown): test is BettererFileTest {
  return (test as BettererFileTest)?.isBettererFileTest === IS_BETTERER_FILE_TEST;
}
