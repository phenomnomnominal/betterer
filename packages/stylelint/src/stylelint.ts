import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import { Configuration, lint } from 'stylelint';

/**
 * @public Use this test to incrementally introduce new {@link https://stylelint.io/ | **Stylelint**} rules
 * to your codebase. You can pass as many **Stylelint** {@link https://stylelint.io/user-guide/rules/list/ | rule configurations}
 * as you like:
 *
 * @remarks {@link @betterer/stylelint#stylelint | `stylelint`} is a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`},
 * so you can use {@link @betterer/betterer#BettererFileTest.include | `include()`}, {@link @betterer/betterer#BettererFileTest.exclude | `exclude()`},
 * {@link @betterer/betterer#BettererFileTest.only | `only()`}, and {@link @betterer/betterer#BettererFileTest.skip | `skip()`}.
 *
 * @example
 * ```typescript
 * import { stylelint } from '@betterer/stylelint';
 *
 * export default {
 *   'new stylelint rules': () =>
 *     stylelint({
 *       rules: {
 *         'unit-no-unknown': true,
 *         'property-no-unknown': true
 *       }
 *     })
 *     .include('./src/*.css', './src/*.scss')
 * ```
 *
 * @param configOverrides - Additional {@link https://stylelint.io/ | **Stylelint**} {@link https://stylelint.io/user-guide/configure/#rules | rules}
 * to enable.
 *
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if the user doesn't pass `configOverrides`.
 */
export function stylelint(configOverrides: Partial<Configuration>): BettererFileTest {
  if (!configOverrides) {
    throw new BettererError(
      'for `@betterer/stylelint` to work, you need to provide configuration options, e.g. `{ rules: { "unit-no-unknown": true } }`. ❌'
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
    if (!filePaths.length) {
      return;
    }

    const result = await lint({
      files: [...filePaths],
      configOverrides
    });

    await Promise.all(
      result.results.map(async (result) => {
        const contents = await fs.readFile(result.source, 'utf8');
        const file = fileTestResult.addFile(result.source, contents);
        result.warnings.forEach((warning) => {
          const { line, column, text } = warning;
          file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);
        });
      })
    );
  });
}
