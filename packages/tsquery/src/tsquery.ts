import { BettererFileIssue, BettererFileIssues, BettererFileTest, BettererFileIssueMap } from '@betterer/betterer';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as stack from 'callsite';
import { promises as fs } from 'fs';
import * as path from 'path';
import { SourceFile } from 'typescript';

import { CONFIG_PATH_REQUIRED, QUERY_REQUIRED } from './errors';

export function tsqueryBetterer(configFilePath: string, query: string): BettererFileTest {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!query) {
    throw QUERY_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const absoluteConfigFilePath = path.resolve(cwd, configFilePath);

  return new BettererFileTest(async (files = []) => {
    let sourceFiles: ReadonlyArray<SourceFile> = [];

    if (files.length === 0) {
      sourceFiles = tsquery.project(absoluteConfigFilePath);
    } else {
      sourceFiles = await Promise.all(
        files.map(async (filePath) => {
          const fileText = await fs.readFile(filePath, 'utf8');
          const sourceFile = tsquery.ast(fileText);
          sourceFile.fileName = filePath;
          return sourceFile;
        })
      );
    }

    return sourceFiles.reduce((fileInfoMap, sourceFile) => {
      fileInfoMap[sourceFile.fileName] = getFileMatches(query, sourceFile);
      return fileInfoMap;
    }, {} as BettererFileIssueMap<BettererFileIssue>);
  });
}

function getFileMatches(query: string, sourceFile: SourceFile): BettererFileIssues<BettererFileIssue> {
  return tsquery.query(sourceFile, query, { visitAllChildren: true }).map((match) => {
    return {
      message: 'TSQuery match',
      filePath: sourceFile.fileName,
      fileText: sourceFile.getFullText(),
      start: match.getStart(),
      end: match.getEnd()
    };
  });
}
