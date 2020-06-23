import {
  BettererFileTest,
  BettererFileIssuesMapRaw,
  BettererFileIssuesRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { promises as fs } from 'fs';

import { FILE_GLOB_REQUIRED, REGEXP_REQUIRED } from './errors';

export function regexpBetterer(globs: string | ReadonlyArray<string>, regexp: RegExp): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!regexp) {
    throw REGEXP_REQUIRED();
  }

  const resolver = new BettererFileResolver();
  resolver.include(globs);

  return new BettererFileTest(resolver, async (files) => {
    regexp = new RegExp(regexp.source, regexp.flags.includes('g') ? regexp.flags : `${regexp.flags}g`);
    const matches = await Promise.all(
      files.map(async (filePath) => {
        return await getFileMatches(regexp, filePath);
      })
    );

    return files.reduce((fileInfoMap, filePath, index) => {
      fileInfoMap[filePath] = matches[index];
      return fileInfoMap;
    }, {} as BettererFileIssuesMapRaw);
  });
}

async function getFileMatches(regexp: RegExp, filePath: string): Promise<BettererFileIssuesRaw> {
  const matches: Array<RegExpExecArray> = [];
  const fileText = await fs.readFile(filePath, 'utf8');

  let currentMatch;
  do {
    currentMatch = regexp.exec(fileText);
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
