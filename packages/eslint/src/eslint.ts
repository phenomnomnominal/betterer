import * as stack from 'callsite';
import { CLIEngine, Linter } from 'eslint';
import * as glob from 'glob';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';
import { promisify } from 'util';

import {
  BettererFileInfo,
  FileBetterer,
  createFileBetterer
} from '@betterer/betterer';
import { error, info } from '@betterer/logger';

const globAsync = promisify(glob);

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(
  files: string | Array<string>,
  rule: ESLintRuleConfig
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const filesArray = Array.isArray(files) ? files : [files];
  const filesGlobs = filesArray.map(glob => path.resolve(cwd, glob));

  return createFileBetterer(async () => {
    const [ruleName, ruleOptions] = rule;

    info(`running ESLint with "${ruleName}" set to "${ruleOptions}"`);

    const cli = new CLIEngine({});
    const errors: Array<BettererFileInfo> = [];

    // This is way less than ideal. ESLint does not currently
    // support running a single lint rule while using the
    // rest of the current configuration.
    //
    // See https://github.com/eslint/eslint/issues/12666 for more.
    //
    // To get around this for now, we need to handle iterating
    // over all the files and getting their configuration.
    //
    // This will be slower than if ESLint handled it, so hopefully
    // they make it possible to do this soon!
    await Promise.all(
      filesGlobs.map(async currentGlob => {
        const filePaths = await globAsync(currentGlob);
        filePaths.map(filePath => {
          const linterOptions = cli.getConfigForFile(filePath);
          const runner = new CLIEngine({
            ...linterOptions,
            useEslintrc: false,
            globals: Object.keys(linterOptions.globals || {}),
            rules: {
              [ruleName]: ruleOptions
            }
          });

          const report = runner.executeOnFiles([filePath]);
          report.results.forEach(result => {
            const { source, messages } = result;
            messages.forEach(message => {
              if (source) {
                errors.push(
                  eslintMessageToBettererError(filePath, source, message)
                );
              }
            });
          });
        });
      })
    );

    if (errors.length) {
      error('ESLint found some issues:');
    }

    return errors;
  });
}

function eslintMessageToBettererError(
  filePath: string,
  source: string,
  message: Linter.LintMessage
): BettererFileInfo {
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
