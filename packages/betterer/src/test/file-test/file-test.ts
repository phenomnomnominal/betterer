import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../../context';
import { createHash } from '../../hasher';
import { NO_PREVIOUS_RESULT } from '../../results';
import { BettererFilePaths } from '../../watcher';
import { BettererTest } from '../test';
import { BettererTestFunction, BettererTestConstraint } from '../types';
import { constraint } from './constraint';
import { differ } from './differ';
import { BettererFile } from './file';
import { BettererFiles } from './files';
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
import { BettererFileResolver } from './file-resolver';

export class BettererFileTest extends BettererTest<BettererFiles, BettererFileIssuesMapSerialised> {
  private _diff: BettererFileTestDiff | null = null;
  private _constraint: BettererTestConstraint<BettererFiles> | null = null;
  private _test: BettererTestFunction<BettererFiles> | null = null;

  constructor(private _resolver: BettererFileResolver, fileTest: BettererFileTestFunction) {
    super({
      test: async (run: BettererRun): Promise<BettererFiles> => {
        this._test = this._test || this._createTest(fileTest);
        return await this._test(run);
      },
      constraint: async (result: BettererFiles, expected: BettererFiles): Promise<ConstraintResult> => {
        this._constraint = this._constraint || this._createConstraint();
        return await this._constraint(result, expected);
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

  public exclude(...excludePatterns: BettererFilePatterns): this {
    this._resolver.exclude(...excludePatterns);
    return this;
  }

  public include(...includePatterns: BettererFileGlobs): this {
    this._resolver.include(...includePatterns);
    return this;
  }

  private _createTest(fileTest: BettererFileTestFunction): BettererTestFunction<BettererFiles> {
    return async (run: BettererRun): Promise<BettererFiles> => {
      const { context, files } = run;

      const expected = run.expected as BettererFiles | typeof NO_PREVIOUS_RESULT;
      const result = await fileTest(await this._resolver.files(files));

      let absolutePaths: BettererFilePaths = Object.keys(result);
      if (files.length && expected !== NO_PREVIOUS_RESULT) {
        const expectedAbsolutePaths = expected.files.map((file) => file.absolutePath);
        absolutePaths = Array.from(new Set([...absolutePaths, ...expectedAbsolutePaths]));
      }
      absolutePaths = await this._resolver.validate(absolutePaths);

      return new BettererFiles(
        absolutePaths
          .map((absolutePath) => {
            const relativePath = context.getRelativePath(absolutePath);
            const issues = result[absolutePath];
            if (!issues && expected !== NO_PREVIOUS_RESULT) {
              return expected.getFile(absolutePath);
            }
            if (issues.length === 0) {
              return null;
            }
            const [issue] = issues;
            return new BettererFile(relativePath, absolutePath, createHash(issue.fileText), issues);
          })
          .filter(Boolean) as ReadonlyArray<BettererFile>
      );
    };
  }

  private _createConstraint() {
    return (result: BettererFiles, expected: BettererFiles): ConstraintResult => {
      const { diff, constraintResult } = constraint(result, expected);
      this._diff = diff;
      return constraintResult;
    };
  }
}
