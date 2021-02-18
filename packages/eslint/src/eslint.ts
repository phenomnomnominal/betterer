import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import assert from 'assert';
import { ESLint, Linter } from 'eslint';

type ESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;

export function eslint(rules: ESLintRulesConfig): BettererFileTest {
  if (!rules) {
    throw new BettererError(
      "for `@betterer/eslint` to work, you need to provide rule options, e.g. `{ 'no-debugger': 'error' }`. ❌"
    );
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (filePaths, fileTestResult) => {
    const { cwd } = resolver;
    const cli = new ESLint({ cwd });

    await Promise.all(
      filePaths.map(async (filePath) => {
        const linterOptions = (await cli.calculateConfigForFile(filePath)) as Linter.Config;

        const runner = new ESLint({
          baseConfig: { ...linterOptions, rules },
          useEslintrc: false,
          cwd
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
