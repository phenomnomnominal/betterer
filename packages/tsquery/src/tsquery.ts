import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { tsquery as tsq } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';

export function tsquery(configFilePath: string, query: string): BettererFileTest {
  if (!configFilePath) {
    throw new BettererError(
      "for `@betterer/tsquery` to work, you need to provide the path to a tsconfig.json file, e.g. `'./tsconfig.json'`. ❌"
    );
  }
  if (!query) {
    throw new BettererError(
      "for `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
    );
  }

  return new BettererFileTest(async (_, fileTestResult, resolver) => {
    const absoluteConfigFilePath = resolver.resolve(configFilePath);
    const projectFiles = resolver.validate(tsq.projectFiles(absoluteConfigFilePath));
    await Promise.all(
      projectFiles.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsq.ast(fileText);
        const matches = tsq.query(sourceFile, query, { visitAllChildren: true });
        if (matches.length === 0) {
          return;
        }
        const file = fileTestResult.addFile(filePath, fileText);
        matches.forEach((match) => {
          file.addIssue(match.getStart(), match.getEnd(), 'TSQuery match');
        });
      })
    );
  });
}

/** @internal Definitely not stable! Please don't use! */
export function tsqueryΔ(query: string): BettererFileTest {
  if (!query) {
    throw new BettererError(
      "for `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
    );
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (filePaths, fileTestResult) => {
    if (filePaths.length === 0) {
      return;
    }

    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const sourceFile = tsq.ast(fileText);
        const matches = tsq.query(sourceFile, query, { visitAllChildren: true });
        if (matches.length === 0) {
          return;
        }
        const file = fileTestResult.addFile(filePath, fileText);
        matches.forEach((match) => {
          file.addIssue(match.getStart(), match.getEnd(), 'TSQuery match');
        });
      })
    );
  });
}
