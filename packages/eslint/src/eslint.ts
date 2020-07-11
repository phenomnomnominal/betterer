import {
  BettererFileTest,
  BettererFileIssueRaw,
  BettererFileIssuesRaw,
  BettererFileIssuesMapRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { Linter, ESLint } from 'eslint';
import LinesAndColumns from 'lines-and-columns';

import { FILE_GLOB_REQUIRED, RULE_OPTIONS_REQUIRED, RULES_OPTIONS_REQUIRED } from './errors';

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];
type ESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;

export function eslint(rules: ESLintRulesConfig): BettererFileTest {
  if (!rules) {
    throw RULES_OPTIONS_REQUIRED();
  }

  return createEslintTest(rules);
}

/**
 * @deprecated Use {@link @betterer/eslint:eslint} instead!
 */
export function eslintBetterer(globs: string | ReadonlyArray<string>, rule: ESLintRuleConfig): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!rule) {
    throw RULE_OPTIONS_REQUIRED();
  }

  const [ruleName, ruleOptions] = rule;
  const test = createEslintTest({ [ruleName]: ruleOptions });
  test.include(globs);
  return test;
}

// We need an extra function so that `new BettererFileResolver()` is called
// from the same depth in the call stack. This is gross, but it can go away
// once we remove `eslintBetterer`:
function createEslintTest(rules: ESLintRulesConfig): BettererFileTest {
  const resolver = new BettererFileResolver(3);
  return new BettererFileTest(resolver, async (files) => {
    const { cwd } = resolver;
    const cli = new ESLint({ cwd });

    const issues: BettererFileIssuesMapRaw = {};
    await Promise.all(
      files.map(async (filePath) => {
        const linterOptions = (await cli.calculateConfigForFile(filePath)) as Linter.Config;
        issues[filePath] = await getFileIssues(cwd, linterOptions, rules, filePath);
      })
    );
    return issues;
  });
}

async function getFileIssues(
  cwd: string,
  linterOptions: Linter.Config,
  rules: ESLintRulesConfig,
  filePath: string
): Promise<BettererFileIssuesRaw> {
  const runner = new ESLint({
    baseConfig: {
      ...linterOptions,
      rules
    },
    useEslintrc: false,
    cwd
  });

  const result = await runner.lintFiles([filePath]);
  const resultsWithSource = result.filter((result) => result.source);
  return ([] as BettererFileIssuesRaw).concat(
    ...resultsWithSource.map((result) => {
      const { source, messages } = result;
      return messages.map((message) => {
        return eslintMessageToBettererError(filePath, source as string, message);
      });
    })
  );
}

function eslintMessageToBettererError(
  filePath: string,
  source: string,
  message: Linter.LintMessage
): BettererFileIssueRaw {
  const lc = new LinesAndColumns(source);
  const startLocation = lc.indexForLocation({
    line: message.line - 1,
    column: message.column - 1
  });
  const endLocation = lc.indexForLocation({
    line: message.endLine ? message.endLine - 1 : 0,
    column: message.endColumn ? message.endColumn - 1 : 0
  });
  return {
    message: message.message,
    filePath: filePath,
    fileText: source,
    start: startLocation as number,
    end: endLocation as number
  };
}
