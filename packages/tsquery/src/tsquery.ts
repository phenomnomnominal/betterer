import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { tsquery as tsq } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';

export function tsquery(configFilePath: string, query: string): BettererFileTest {
  if (!configFilePath) {
    throw new BettererError(
      "For `@betterer/tsquery` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
    );
  }
  if (!query) {
    throw new BettererError(
      "For `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
    );
  }

  const resolver = new BettererFileResolver();
  const absoluteConfigFilePath = resolver.resolve(configFilePath);

  return new BettererFileTest(resolver, async (_, fileTestResult) => {
    const projectFiles = await resolver.validate(tsq.projectFiles(absoluteConfigFilePath));
    await Promise.all(
      projectFiles.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsq.ast(fileText);
        const file = fileTestResult.addFile(filePath, fileText);
        tsq.query(sourceFile, query, { visitAllChildren: true }).forEach((match) => {
          file.addIssue(match.getStart(), match.getEnd(), 'TSQuery match');
        });
      })
    );
  });
}
