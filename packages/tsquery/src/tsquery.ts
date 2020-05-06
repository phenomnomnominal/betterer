import { tsquery } from '@phenomnomnominal/tsquery';
import * as stack from 'callsite';
import * as path from 'path';

import { BettererFileInfo, FileBetterer, createFileBetterer } from '@betterer/betterer';
import { CONFIG_PATH_REQUIRED, QUERY_REQUIRED } from './errors';

export function tsqueryBetterer(configFilePath: string, query: string): FileBetterer {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!query) {
    throw QUERY_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absPath = path.resolve(cwd, configFilePath);
  return createFileBetterer(() => {
    const sourceFiles = tsquery.project(absPath);
    const matches: Array<BettererFileInfo> = [];
    sourceFiles.forEach((sourceFile) => {
      tsquery.query(sourceFile, query, { visitAllChildren: true }).forEach((match) => {
        matches.push({
          message: `TSQuery match`,
          filePath: sourceFile.fileName,
          fileText: sourceFile.getFullText(),
          start: match.getStart(),
          end: match.getEnd()
        });
      });
    });

    return matches;
  });
}
