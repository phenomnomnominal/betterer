import { CLIEngine, Linter } from 'eslint';
import * as stack from 'callsite';
import * as path from 'path';

import { FileBetterer, createFileBetterer } from '@betterer/betterer';
import { error, info } from '@betterer/logger';

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(
  files: string | Array<string>,
  rule: ESLintRuleConfig
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const filesArray = Array.isArray(files) ? files : [files];
  const filesGlobs = filesArray.map(glob => path.resolve(cwd, glob));

  return createFileBetterer(() => {
    const [ruleName, ruleOptions] = rule;

    info(`running ESLint with "${ruleName}" set to "${ruleOptions}"`);

    const cli = new CLIEngine({ rules: { [ruleName]: ruleOptions } });
    const report = cli.executeOnFiles(filesGlobs);

    if (report.errorCount) {
      error('ESLint found some issues:');
      const formatter = cli.getFormatter();
      console.log(formatter(report.results));
    }
    return report.errorCount;
  });
}
