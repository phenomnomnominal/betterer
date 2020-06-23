import {
  BettererFileTest,
  BettererFileIssueRaw,
  BettererFileIssuesRaw,
  BettererFileIssuesMapRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { CLIEngine, Linter } from 'eslint';
import LinesAndColumns from 'lines-and-columns';

import { FILE_GLOB_REQUIRED, RULE_OPTIONS_REQUIRED } from './errors';

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(globs: string | ReadonlyArray<string>, rule: ESLintRuleConfig): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!rule) {
    throw RULE_OPTIONS_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  resolver.include(globs);

  return new BettererFileTest(resolver, (files) => {
    const { cwd } = resolver;
    const cli = new CLIEngine({ cwd });

    return files.reduce((fileInfoMap, filePath) => {
      const linterOptions = cli.getConfigForFile(filePath);
      fileInfoMap[filePath] = getFileIssues(cwd, linterOptions, rule, filePath);
      return fileInfoMap;
    }, {} as BettererFileIssuesMapRaw);
  });
}

function getFileIssues(
  cwd: string,
  linterOptions: Linter.Config,
  rule: ESLintRuleConfig,
  filePath: string
): BettererFileIssuesRaw {
  const [ruleName, ruleOptions] = rule;
  const runner = new CLIEngine({
    ...linterOptions,
    cwd,
    useEslintrc: false,
    globals: Object.keys(linterOptions.globals || {}),
    rules: {
      [ruleName]: ruleOptions
    }
  });

  const report = runner.executeOnFiles([filePath]);
  const resultsWithSource = report.results.filter((result) => result.source);
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
