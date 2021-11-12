import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { tsquery as tsq } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';

/**
 * @public Use this test to incrementally remove **TSQuery** matches from your codebase. See the {@link https://github.com/phenomnomnominal/tsquery | **TSQuery** documentation }
 * for more details about the query syntax.
 *
 * @remarks {@link @betterer/tsquery#tsquery | `tsquery`} is a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`},
 * so you can use {@link @betterer/betterer#BettererFileTest.include | `include()`}, {@link @betterer/betterer#BettererFileTest.exclude | `exclude()`},
 * {@link @betterer/betterer#BettererFileTest.only | `only()`}, and {@link @betterer/betterer#BettererFileTest.skip | `skip()`}.
 *
 * @example
 * ```typescript
 * import { tsquery } from '@betterer/tsquery';
 *
 * export default {
 *   'no raw console.log': () =>
 *     tsquery(
 *       'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
 *      )
 *      .include('./src/*.ts')
 * };
 * ```
 *
 * @param query - A {@link https://github.com/phenomnomnominal/tsquery | **TSQuery**} query to match.
 *
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if the user doesn't pass `query`.
 */
export function tsquery(query: string): BettererFileTest {
  if (!query) {
    throw new BettererError(
      "for `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
    if (filePaths.length === 0) {
      return;
    }

    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsq.ast(fileText);
        const matches = tsq.query(sourceFile, query, { visitAllChildren: true });
        if (matches.length === 0) {
          return;
        }
        const file = fileTestResult.addFile(filePath, fileText);
        matches.forEach((match) => {
          file.addIssue(match.getStart(), match.getEnd(), 'TSQuery match');
        });
      })
    );
  });
}
