import { BettererFileResolver, BettererFileTest } from '@betterer/betterer';
import { promises as fs } from 'fs';

import { REGEXP_REQUIRED } from './errors';

export function regexp(pattern: RegExp): BettererFileTest {
  if (!pattern) {
    throw REGEXP_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (filePaths, files) => {
    pattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const file = files.addFile(filePath, fileText);
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
