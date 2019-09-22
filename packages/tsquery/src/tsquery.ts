import { tsquery } from '@phenomnomnominal/tsquery';

import { Betterer } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
import { code, error, info, LoggerCodeInfo } from '@betterer/logger';

export function tsqueryBetterer(
  configFilePath: string,
  query: string
): Betterer {
  return {
    test: (): number => createTsqueryTest(configFilePath, query),
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
          filePath: sourceFile.fileName,
          fileText: sourceFile.getFullText(),
          start: match.getStart(),
          end: match.getEnd()
        });
      });
  });

  if (matches.length) {
    error(`Found ${matches.length} TSQuery matches:`);
    console.log('');
    matches.forEach(match => {
      console.log(`Match found in file "${match.filePath}":\n`);
      code(match);
    });
  }
  return matches.length;
}
