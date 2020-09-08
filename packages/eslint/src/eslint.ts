import { BettererFileTest, BettererFileResolver } from '@betterer/betterer';
import * as assert from 'assert';
import { Linter, ESLint } from 'eslint';

import { RULES_OPTIONS_REQUIRED } from './errors';

type ESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;

export function eslint(rules: ESLintRulesConfig): BettererFileTest {
  if (!rules) {
    throw RULES_OPTIONS_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (filePaths, files) => {
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
          .filter((result) => result.source)
          .forEach((result) => {
            const { messages, source } = result;
            assert(source);
            const file = files.addFile(filePath, source);
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
