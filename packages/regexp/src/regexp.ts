import {
  BettererFileTest,
  BettererFileIssuesMapRaw,
  BettererFileIssuesRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { promises as fs } from 'fs';

import { REGEXP_REQUIRED } from './errors';

export function regexp(pattern: RegExp): BettererFileTest {
  if (!pattern) {
    throw REGEXP_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  return new BettererFileTest(resolver, async (files) => {
    pattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    const matches = await Promise.all(
      files.map(async (filePath) => {
        return await getFileMatches(pattern, filePath);
      })
    );

    const issues: BettererFileIssuesMapRaw = {};
    files.forEach((filePath, index) => {
      issues[filePath] = matches[index];
    });
    return issues;
  });
}

async function getFileMatches(pattern: RegExp, filePath: string): Promise<BettererFileIssuesRaw> {
  const matches: Array<RegExpExecArray> = [];
  const fileText = await fs.readFile(filePath, 'utf8');

  let currentMatch;
  do {
    currentMatch = pattern.exec(fileText);
    if (currentMatch) {
      matches.push(currentMatch);
    }
  } while (currentMatch);

  return matches.map((match) => {
    const [matchText] = match;
    return {
      message: 'RegExp match',
      filePath,
      fileText,
      start: match.index,
      end: match.index + matchText.length
    };
  });
}
