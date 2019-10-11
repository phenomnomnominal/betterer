import { CLIEngine, Linter } from 'eslint';
import * as stack from 'callsite';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';

import {
  BettererFileCodeInfo,
  FileBetterer,
  createFileBetterer
} from '@betterer/betterer';
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
    }

    const errors: Array<BettererFileCodeInfo> = [];
    report.results.forEach(result => {
      result.messages.forEach(message => {
        const lc = new LinesAndColumns(message.source as string);
        const startLocation = lc.indexForLocation({
          line: message.line,
          column: message.column
        });
        const endLocation = lc.indexForLocation({
          line: message.endLine || 0,
          column: message.endColumn || 0
        });
        errors.push({
          message: message.message,
          filePath: result.filePath,
          fileText: result.source as string,
          start: startLocation as number,
          end: endLocation as number
        });
      });
    });

    return errors;
  });
}
