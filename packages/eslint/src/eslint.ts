import type { Linter } from 'eslint';

import type { BettererESLintRulesConfig } from './types.js';

import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import assert from 'node:assert';
import { ESLint } from 'eslint';

/**
 * @public Use this test to incrementally introduce new {@link https://eslint.org/ | **ESLint**} rules to
 * your codebase. You can pass as many **ESLint** {@link https://eslint.org/docs/rules/ | rule configurations}
 * as you like:
 *
 * @remarks {@link @betterer/eslint#eslint | `eslint`} is a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`},
 * so you can use {@link @betterer/betterer#BettererFileTest.include | `include()`},
 * {@link @betterer/betterer#BettererFileTest.exclude | `exclude()`}, {@link @betterer/betterer#BettererFileTest.only | `only()`},
 * and {@link @betterer/betterer#BettererFileTest.skip | `skip()`}.
 *
 * @example
 * ```typescript
 * import { eslint } from '@betterer/eslint';
 *
 * export default {
 *   'new eslint rules': () =>
 *     eslint({
 *       'no-debugger': 'error',
 *       'no-unsafe-finally': 'error',
 *     })
 *     .include('./src/*.ts')
 * };
 * ```
 *
 * @param rules - Additional {@link https://eslint.org/ | **ESLint**} {@link https://eslint.org/docs/rules/ | rules}
 * to enable.
 *
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if the user doesn't pass `rules`.
 */
export function eslint(rules: BettererESLintRulesConfig): BettererFileTest {
  if (!rules) {
    throw new BettererError(
      "for `@betterer/eslint` to work, you need to provide rule options, e.g. `{ 'no-debugger': 'error' }`. ❌"
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult, resolver) => {
    if (!filePaths.length) {
      return;
    }

    const { baseDirectory } = resolver;
    const cli = new ESLint({ cwd: baseDirectory });

    await Promise.all(
      filePaths.map(async (filePath) => {
        const linterOptions = (await cli.calculateConfigForFile(filePath)) as Linter.Config;

        // Explicitly disable all other configured rules:
        const disabledRules: BettererESLintRulesConfig = {};
        Object.keys(linterOptions.rules || {}).forEach((ruleName) => {
          disabledRules[ruleName] = 'off';
        });
        const finalRules = { ...disabledRules, ...rules };

        const runner = new ESLint({
          overrideConfig: { rules: finalRules },
          useEslintrc: true,
          cwd: baseDirectory
        });

        const lintResults = await runner.lintFiles([filePath]);
        lintResults
          .filter((lintResult) => lintResult.source)
          .forEach((lintResult) => {
            const { messages, source } = lintResult;
            assert(source);
            const file = fileTestResult.addFile(filePath, source);
            messages.forEach((message) => {
              const startLine = message.line - 1;
              const startColumn = message.column - 1;
              const endLine = message.endLine ? message.endLine - 1 : 0;
              const endColumn = message.endColumn ? message.endColumn - 1 : 0;
              file.addIssue(startLine, startColumn, endLine, endColumn, message.message);
            });
          });
      })
    );
  });
}
