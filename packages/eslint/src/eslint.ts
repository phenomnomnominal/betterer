import {
  BettererFileTest,
  BettererFileIssueRaw,
  BettererFileIssuesRaw,
  BettererFileIssuesMapRaw
} from '@betterer/betterer';
import * as stack from 'callsite';
import { CLIEngine, Linter } from 'eslint';
import * as glob from 'glob';
import LinesAndColumns from 'lines-and-columns';
import * as minimatch from 'minimatch';
import * as path from 'path';
import { promisify } from 'util';

import { FILE_GLOB_REQUIRED, RULE_OPTIONS_REQUIRED } from './errors';

const globAsync = promisify(glob);

type ESLintRuleConfig = [string, Linter.RuleLevel | Linter.RuleLevelAndOptions];

export function eslintBetterer(globs: string | ReadonlyArray<string>, rule: ESLintRuleConfig): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!rule) {
    throw RULE_OPTIONS_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const globsArray = Array.isArray(globs) ? globs : [globs];
  const resolvedGlobs = globsArray.map((glob) => path.resolve(cwd, glob));

  return new BettererFileTest(async (files) => {
    const cli = new CLIEngine({});

    let testFiles: Array<string> = [];
    if (files.length !== 0) {
      testFiles = files.filter((filePath) => resolvedGlobs.find((currentGlob) => minimatch(filePath, currentGlob)));
    } else {
      await Promise.all(
        resolvedGlobs.map(async (currentGlob) => {
          const globFiles = await globAsync(currentGlob);
          testFiles.push(...globFiles);
        })
      );
    }

    return testFiles.reduce((fileInfoMap, filePath) => {
      const linterOptions = cli.getConfigForFile(filePath);
      fileInfoMap[filePath] = getFileIssues(linterOptions, rule, filePath);
      return fileInfoMap;
    }, {} as BettererFileIssuesMapRaw);
  });
}

function getFileIssues(linterOptions: Linter.Config, rule: ESLintRuleConfig, filePath: string): BettererFileIssuesRaw {
  const [ruleName, ruleOptions] = rule;
  const runner = new CLIEngine({
    ...linterOptions,
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
