import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export function regexp(pattern: RegExp): BettererFileTest {
  if (!pattern) {
    throw new BettererError('For `@betterer/regexp` to work, you need to provide a RegExp, e.g. `/^foo$/`. ❌');
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (filePaths, fileTestResult) => {
    pattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const file = fileTestResult.addFile(filePath, fileText);
        const matches = getFileMatches(pattern, fileText);
        matches.forEach((match) => {
          const [matchText] = match;
          const start = match.index;
          file.addIssue(start, start + matchText.length, 'RegExp match');
        });
      })
    );
  });
}

function getFileMatches(pattern: RegExp, fileText: string): Array<RegExpExecArray> {
  const matches: Array<RegExpExecArray> = [];

  let currentMatch;
  do {
    currentMatch = pattern.exec(fileText);
    if (currentMatch) {
      matches.push(currentMatch);
    }
  } while (currentMatch);

  return matches;
}
