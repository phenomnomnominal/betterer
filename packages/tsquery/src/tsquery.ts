import { tsquery } from '@phenomnomnominal/tsquery';
import * as stack from 'callsite';
import { promises as fs } from 'fs';
import * as path from 'path';
import { SourceFile } from 'typescript';

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
  const absoluteConfigFilePath = path.resolve(cwd, configFilePath);
  return createFileBetterer(async (files: Array<string> = []) => {
    info(`running TSQuery to search for nodes matching query "${query}"`);

    const matches: Array<BettererFileInfo> = [];

    let sourceFiles: Array<SourceFile> = [];
    if (!files) {
      sourceFiles = tsquery.project(absoluteConfigFilePath);
    } else {
      sourceFiles = await Promise.all(
        files.map(async filePath => {
          const fileText = await fs.readFile(filePath, 'utf8');
          return tsquery.ast(fileText);
        })
      );
    }

    sourceFiles.forEach(sourceFile => {
      matches.push(...getFileMatches(query, sourceFile));
    });

    if (matches.length) {
      error('TSQuery found some matches:');
    }

    return matches;
  });
}

function getFileMatches(
  query: string,
  sourceFile: SourceFile
): Array<BettererFileInfo> {
  return tsquery
    .query(sourceFile, query, { visitAllChildren: true })
    .map(match => {
      return {
        message: `TSQuery match`,
        filePath: sourceFile.fileName,
        fileText: sourceFile.getFullText(),
        start: match.getStart(),
        end: match.getEnd()
      };
    });
}
