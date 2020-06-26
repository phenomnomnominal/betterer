import {
  BettererFileTest,
  BettererFileIssuesMapRaw,
  BettererFileIssuesRaw,
  BettererFileResolver
} from '@betterer/betterer';
import { promises as fs } from 'fs';

import { FILE_GLOB_REQUIRED, REGEXP_REQUIRED } from './errors';

export function regexp(pattern: RegExp): BettererFileTest {
  if (!pattern) {
    throw REGEXP_REQUIRED();
  }

  return createRegExpTest(pattern);
}

/**
 * @deprecated Use {@link @betterer/regexp:regexp} instead!
 */
export function regexpBetterer(globs: string | ReadonlyArray<string>, pattern: RegExp): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!pattern) {
    throw REGEXP_REQUIRED();
  }

  const test = createRegExpTest(pattern);
  test.include(globs);
  return test;
}

// We need an extra function so that `new BettererFileResolver()` is called
// from the same depth in the call stack. This is gross, but it can go away
// once we remove `regexpBetterer`:
function createRegExpTest(pattern: RegExp): BettererFileTest {
  const resolver = new BettererFileResolver(3);
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
