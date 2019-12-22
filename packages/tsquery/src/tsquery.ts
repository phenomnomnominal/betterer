import { tsquery } from '@phenomnomnominal/tsquery';
import * as stack from 'callsite';
import * as path from 'path';

import {
  BettererFileInfo,
  FileBetterer,
  createFileBetterer
} from '@betterer/betterer';
import { error, info } from '@betterer/logger';

export function tsqueryBetterer(
  configFilePath: string,
  query: string
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);
  return createFileBetterer(() => {
    info(`running TSQuery to search for nodes matching query "${query}"`);

    const sourceFiles = tsquery.project(absPath);
    const matches: Array<BettererFileInfo> = [];
    sourceFiles.forEach(sourceFile => {
      tsquery
        .query(sourceFile, query, { visitAllChildren: true })
        .forEach(match => {
          matches.push({
            message: `TSQuery match`,
            filePath: sourceFile.fileName,
            fileText: sourceFile.getFullText(),
            start: match.getStart(),
            end: match.getEnd()
          });
        });
    });

    if (matches.length) {
      error('TSQuery found some matches:');
    }

    return matches;
  });
}
