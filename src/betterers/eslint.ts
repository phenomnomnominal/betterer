import { CLIEngine, Linter } from 'eslint';
import * as stack from 'callsite';
import * as path from 'path';

import { Betterer } from '../better/types';
import { smaller } from '../constraints';
import { error, info } from '../logger';

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(
  files: string | Array<string>,
  rule: ESLintRuleConfig
): Betterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const filesArray = Array.isArray(files) ? files : [files];
  const filesGlobs = filesArray.map(glob => path.resolve(cwd, glob));
  console.log(filesGlobs);

  return {
    test: (): number => createEslintTest(filesGlobs, rule),
    constraint: smaller,
    goal: 0
  };
}

function createEslintTest(
  files: Array<string>,
  rule: ESLintRuleConfig
): number {
  const [ruleName, ruleOptions] = rule;

  info(`running ESLint with "${ruleName}" set to "${ruleOptions}"`);

  const cli = new CLIEngine({ rules: { [ruleName]: ruleOptions } });
  const report = cli.executeOnFiles(files);

  if (report.errorCount) {
    error('ESLint found some issues:');
    const formatter = cli.getFormatter();
    console.log(formatter(report.results));
  }
  return report.errorCount;
}
