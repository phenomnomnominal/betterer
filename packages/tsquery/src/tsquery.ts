import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { tsquery as tsq } from '@phenomnomnominal/tsquery';
import { promises as fs } from 'fs';

export function tsquery(query: string): BettererFileTest {
  if (!query) {
    throw new BettererError(
      "for `@betterer/tsquery` to work, you need to provide a query, e.g. `'CallExpression > PropertyAccessExpression'`. ❌"
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
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
