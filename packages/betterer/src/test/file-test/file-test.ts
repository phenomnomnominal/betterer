import { ConstraintResult } from '@betterer/constraints';

import { BettererRun, BettererContext } from '../../context';
import { createHash } from '../../hasher';
import { getRelativePath, getAbsolutePath } from '../../utils';
import { BettererFilePaths } from '../../watcher';
import { BettererTest } from '../test';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFile } from './file';
import { BettererFiles } from './files';
import { goal } from './goal';
import { printer } from './printer';
import { deserialise, serialise } from './serialiser';
import {
  BettererFileExcluded,
  BettererFilesResult,
  BettererFilesDeserialised,
  BettererFileIssuesMapSerialised,
  BettererFileTestFunction,
  BettererFileIssue,
  BettererFileTestDiff
} from './types';

export class BettererFileTest extends BettererTest<
  BettererFilesResult,
  BettererFilesDeserialised,
  BettererFileIssuesMapSerialised
> {
  private _excluded: BettererFileExcluded = [];
  private _diff: BettererFileTestDiff | null = null;

  constructor(fileTest: BettererFileTestFunction) {
    super({
      test: async (run: BettererRun): Promise<BettererFilesResult> => {
        const { context, files } = run;

        const result = await fileTest(files);

        const { resultsPath } = context.config;
        return new BettererFiles(
          Object.keys(result)
            .map((filePath) => {
              if (!this._excluded.some((exclude: RegExp) => exclude.test(filePath)) && result[filePath].length) {
                const issues = result[filePath];
                const [{ fileText }] = issues;
                const relativePath = getRelativePath(resultsPath, filePath);
                return new BettererFile(relativePath, createHash(fileText), issues);
              }
              return null;
            })
            .filter(Boolean) as ReadonlyArray<BettererFile<BettererFileIssue>>
        );
      },
      constraint: (result: BettererFilesResult, expected: BettererFilesDeserialised): ConstraintResult => {
        const { diff, constraintResult } = constraint(result, expected);
        if (diff) {
          this._diff = diff;
        }
        return constraintResult;
      },
      goal,

      serialiser: {
        deserialise,
        serialise
      },
      differ,
      printer
    });
  }

  public get diff(): BettererFileTestDiff {
    if (!this._diff) {
      throw new Error();
    }
    return this._diff;
  }

  public exclude(...excludePatterns: BettererFileExcluded): this {
    this._excluded = [...this._excluded, ...excludePatterns];
    return this;
  }

  public getExpected(
    context: BettererContext,
    expected: BettererFilesDeserialised,
    files: BettererFilePaths
  ): BettererFilesDeserialised {
    if (!files.length) {
      return expected;
    }
    return new BettererFiles(
      expected.files.filter((file) => {
        return files.includes(getAbsolutePath(context.config.resultsPath, file.filePath));
      })
    );
  }
}
