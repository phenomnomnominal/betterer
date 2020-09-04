import { getConfig } from '../../config';
import { BettererRun } from '../../context';
import { createHash } from '../../hasher';
import { BettererFilePaths } from '../../watcher';
import { getRelativePath } from '../../utils';
import { BettererTest } from '../test';
import { BettererTestFunction } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFileΩ } from './file';
import { BettererFileResolver } from './file-resolver';
import { BettererFilesΩ } from './files';
import { goal } from './goal';
import { printer } from './printer';
import { deserialise, serialise } from './serialiser';
import {
  BettererFilePatterns,
  BettererFileGlobs,
  BettererFileIssuesMapSerialised,
  BettererFileTestFunction,
  BettererFileTestDiff
} from './types';

const IS_BETTERER_FILE_TEST = 'isBettererFileTest';

export class BettererFileTest extends BettererTest<
  BettererFilesΩ,
  BettererFileIssuesMapSerialised,
  BettererFileTestDiff
> {
  public readonly isBettererFileTest = IS_BETTERER_FILE_TEST;

  private _test: BettererTestFunction<BettererFilesΩ> | null = null;

  constructor(private _resolver: BettererFileResolver, fileTest: BettererFileTestFunction) {
    super({
      test: async (run: BettererRun): Promise<BettererFilesΩ> => {
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

  private _createTest(fileTest: BettererFileTestFunction): BettererTestFunction<BettererFilesΩ> {
    return async (run: BettererRun): Promise<BettererFilesΩ> => {
      const { files } = run;

      const expected = run.expected.value as BettererFilesΩ;
      const result = await fileTest(await this._resolver.filesΔ(files));

      let absolutePaths: BettererFilePaths = Object.keys(result);
      if (files.length && !run.isNew) {
        const expectedAbsolutePaths = expected.filesΔ.map((file) => file.absolutePath);
        absolutePaths = Array.from(new Set([...absolutePaths, ...expectedAbsolutePaths]));
      }
      absolutePaths = await this._resolver.validate(absolutePaths);

      return new BettererFilesΩ(
        absolutePaths
          .map((absolutePath) => {
            const { resultsPath } = getConfig();
            const relativePath = getRelativePath(resultsPath, absolutePath);
            const issues = result[absolutePath];
            if (!issues && !run.isNew) {
              return expected.getFileΔ(absolutePath);
            }
            if (issues.length === 0) {
              return null;
            }
            const [issue] = issues;
            return new BettererFileΩ(relativePath, absolutePath, createHash(issue.fileText), issues);
          })
          .filter(Boolean) as ReadonlyArray<BettererFileΩ>
      );
    };
  }
}

export function isBettererFileTest(test: unknown): test is BettererFileTest {
  return (test as BettererFileTest)?.isBettererFileTest === IS_BETTERER_FILE_TEST;
}
