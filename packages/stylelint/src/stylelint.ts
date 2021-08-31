import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import { Configuration, lint } from 'stylelint';

/**
 * {@link https://www.npmjs.com/package/@betterer/stylelint | `@betterer/stylelint`}
 *
 * Use this test to incrementally introduce new {@link https://stylelint.io/ | **Stylelint**} rules to your codebase. You can pass as many **Stylelint** {@link https://stylelint.io/user-guide/rules/list/ | rule configurations} as you like:
 *
 * {@link stylelint | `stylelint`} is a {@link BettererFileTest | `BettererFileTest`}, so you can use {@link BettererFileTest.include | `exclude`}, {@link BettererFileTest.exclude | `exclude`}, {@link BettererFileTest.only | `only`}, and {@link BettererFileTest.skip | `skip`}.
 *
 * @example
 * ```typescript
 * import { stylelint } from '@betterer/stylelint';
 *
 * export default {
 *   'new stylelint rules': () => stylelint({
 *     rules: {
 *       'unit-no-unknown': true,
 *       'property-no-unknown': true
 *     }
 *   })
 *   .include('./src/*.css', './src/*.scss')
 * ```
 *
 * @public
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
