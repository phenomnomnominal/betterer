import {
  BettererFileTest,
  BettererFileIssuesMapRaw,
  BettererFileIssuesRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { tsquery } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';
import { SourceFile } from 'typescript';

import { CONFIG_PATH_REQUIRED, QUERY_REQUIRED } from './errors';

export function tsqueryBetterer(configFilePath: string, query: string): BettererFileTest {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!query) {
    throw QUERY_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  const absoluteConfigFilePath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, async () => {
    let sourceFiles: ReadonlyArray<SourceFile> = [];

    const projectFiles = await resolver.validate(tsquery.projectFiles(absoluteConfigFilePath));
    sourceFiles = await Promise.all(
      projectFiles.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsquery.ast(fileText);
        sourceFile.fileName = filePath;
        return sourceFile;
      })
    );

    return sourceFiles.reduce((fileInfoMap, sourceFile) => {
      fileInfoMap[sourceFile.fileName] = getFileMatches(query, sourceFile);
      return fileInfoMap;
    }, {} as BettererFileIssuesMapRaw);
  });
}

function getFileMatches(query: string, sourceFile: SourceFile): BettererFileIssuesRaw {
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
