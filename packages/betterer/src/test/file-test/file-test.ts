import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../../context';
import { createHash } from '../../hasher';
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
  BettererFileIssuesMapSerialised,
  BettererFileTestFunction,
  BettererFileTestDiff
} from './types';

export class BettererFileTest extends BettererTest<BettererFiles, BettererFileIssuesMapSerialised> {
  private _excluded: BettererFileExcluded = [];
  private _diff: BettererFileTestDiff | null = null;

  constructor(fileTest: BettererFileTestFunction) {
    super({
      test: async (run: BettererRun): Promise<BettererFiles> => {
        const { context, files } = run;

        const expected = run.expected as BettererFiles;
        const result = await fileTest(files);

        let absolutePaths = Object.keys(result);
        if (files.length) {
          const expectedAbsolutePaths = expected?.files.map((file) => file.absolutePath) || [];
          absolutePaths = Array.from(new Set([...absolutePaths, ...expectedAbsolutePaths]));
        }

        return new BettererFiles(
          absolutePaths
            .map((absolutePath) => {
              if (!this._excluded.some((exclude: RegExp) => exclude.test(absolutePath))) {
                const relativePath = context.getRelativePath(absolutePath);
                const issues = result[absolutePath];
                if (!issues) {
                  return expected.getFile(absolutePath);
                }
                if (issues.length === 0) {
                  return null;
                }
                const [issue] = issues;
                return new BettererFile(relativePath, absolutePath, createHash(issue.fileText), issues);
              }
              return null;
            })
            .filter(Boolean) as ReadonlyArray<BettererFile>
        );
      },
      constraint: (result: BettererFiles, expected: BettererFiles): ConstraintResult => {
        const { diff, constraintResult } = constraint(result, expected);
        this._diff = diff;
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

  public get diff(): BettererFileTestDiff | null {
    return this._diff;
  }

  public exclude(...excludePatterns: BettererFileExcluded): this {
    this._excluded = [...this._excluded, ...excludePatterns];
    return this;
  }
}
