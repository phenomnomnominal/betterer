import { tsquery } from '@phenomnomnominal/tsquery';
import * as stack from 'callsite';
import * as path from 'path';

import { Betterer } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
import { code, error, info, LoggerCodeInfo } from '@betterer/logger';

export function tsqueryBetterer(
  configFilePath: string,
  query: string
): Betterer<number> {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);
  return {
    test: (): number => createTsqueryTest(absPath, query),
    constraint: smaller,
    goal: 0
  };
}

function createTsqueryTest(configFilePath: string, query: string): number {
  info(`running TSQuery to search for nodes matching query "${query}"`);

  const sourceFiles = tsquery.project(configFilePath);
  const matches: Array<LoggerCodeInfo> = [];
  sourceFiles.forEach(sourceFile => {
    tsquery
      .query(sourceFile, query, { visitAllChildren: true })
      .forEach(match => {
        matches.push({
          message: `TSQuery match:`,
          filePath: sourceFile.fileName,
          fileText: sourceFile.getFullText(),
          start: match.getStart(),
          end: match.getEnd()
        });
      });
  });

  if (matches.length) {
    error(`found ${matches.length} TSQuery matches:`);
    const matchesPerFile: Record<string, Array<LoggerCodeInfo>> = {};
    matches.forEach(match => {
      matchesPerFile[match.filePath] = matchesPerFile[match.filePath] || [];
      matchesPerFile[match.filePath].push(match);
    });
    Object.keys(matchesPerFile).forEach(filePathInfo => {
      error(`"${filePathInfo}":`);
      matchesPerFile[filePathInfo].forEach(match => code(match));
    });
  }
  return matches.length;
}
