import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';
import { Configuration, lint } from 'stylelint';

export function stylelint(configOverrides: Partial<Configuration>): BettererFileTest {
  if (!configOverrides) {
    throw new BettererError(
      'for `@betterer/stylelint` to work, you need to provide configuration options, e.g. `{ rules: { "unit-no-unknown": true } }`. ❌'
    );
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
    if (!filePaths.length) {
      return;
    }

    const result = await lint({
      files: [...filePaths],
      configOverrides
    });

    await Promise.all(
      result.results.map(async (result) => {
        const contents = await fs.readFile(result.source, 'utf8');
        const file = fileTestResult.addFile(result.source, contents);
        result.warnings.forEach((warning) => {
          const { line, column, text } = warning;
          file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);
        });
      })
    );
  });
}
