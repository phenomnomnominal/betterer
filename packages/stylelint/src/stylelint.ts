import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import { Config, lint, LintResult } from 'stylelint';

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
export function stylelint(configOverrides: Config): BettererFileTest {
  if (!configOverrides) {
    throw new BettererError(
      'for `@betterer/stylelint` to work, you need to provide configuration options, e.g. `{ rules: { "unit-no-unknown": true } }`. ❌'
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
    if (!filePaths.length) {
      return;
    }

    const { results } = await lint({
      files: [...filePaths],
      config: configOverrides
    });

    await Promise.all(
      results
        .filter((result): result is Required<LintResult> => !!result.source)
        .map(async ({ source, warnings }) => {
          const contents = await fs.readFile(source, 'utf8');
          const file = fileTestResult.addFile(source, contents);
          warnings.forEach((warning) => {
            const { line, column, text } = warning;
            file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);
          });
        })
    );
  });
}
