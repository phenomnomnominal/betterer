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

const globAsync = promisify(glob);

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(
  globs: string | ReadonlyArray<string>,
  rule: ESLintRuleConfig
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const globsArray = Array.isArray(globs) ? globs : [globs];
  const resolvedGlobs = globsArray.map(glob => path.resolve(cwd, glob));

  return createFileBetterer(async (files: ReadonlyArray<string> = []) => {
    const cli = new CLIEngine({});

    const testFiles = [...files];
    if (testFiles.length === 0) {
      await Promise.all(
        resolvedGlobs.flatMap(async currentGlob => {
          const globFiles = await globAsync(currentGlob);
          testFiles.push(...globFiles);
        })
      );
    }

    return await Promise.all(
      testFiles.flatMap(filePath => {
        const linterOptions = cli.getConfigForFile(filePath);
        return getFileIssues(linterOptions, rule, filePath);
      })
    );
  });
}

function getFileIssues(
  linterOptions: Linter.Config,
  rule: ESLintRuleConfig,
  filePath: string
): ReadonlyArray<BettererFileInfo> {
  const [ruleName, ruleOptions] = rule;
  const runner = new CLIEngine({
    ...linterOptions,
    useEslintrc: false,
    globals: Object.keys(linterOptions.globals || {}),
    rules: {
      [ruleName]: ruleOptions
    }
  });

  const issues: Array<BettererFileInfo> = [];
  const report = runner.executeOnFiles([filePath]);
  report.results.forEach(result => {
    const { source, messages } = result;
    messages.forEach(message => {
      if (source) {
        issues.push(eslintMessageToBettererError(filePath, source, message));
      }
    });
  });
  return issues;
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
