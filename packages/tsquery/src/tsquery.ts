import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { tsquery as tsq } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';

import { CONFIG_PATH_REQUIRED, QUERY_REQUIRED } from './errors';

export function tsquery(configFilePath: string, query: string): BettererFileTest {
  if (!configFilePath) {
    throw CONFIG_PATH_REQUIRED();
  }
  if (!query) {
    throw QUERY_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  const absoluteConfigFilePath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, async (_, files) => {
    const projectFiles = await resolver.validate(tsq.projectFiles(absoluteConfigFilePath));
    await Promise.all(
      projectFiles.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsq.ast(fileText);
        const file = files.addFile(filePath, fileText);
        tsq.query(sourceFile, query, { visitAllChildren: true }).forEach((match) => {
          file.addIssue(match.getStart(), match.getEnd(), 'TSQuery match');
        });
      })
    );
  });
}
