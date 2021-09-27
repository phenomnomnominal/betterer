import { BettererFileTest } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

/**
 * @public {@link https://www.npmjs.com/package/@betterer/regexp | `@betterer/regexp`}
 *
 * Use this test to incrementally remove {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp | **RegExp**} matches from your codebase.
 *
 * {@link regexp | `regexp`} is a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}, so you can use {@link @betterer/betterer#BettererFileTest.include | `exclude`}, {@link @betterer/betterer#BettererFileTest.exclude | `exclude`}, {@link @betterer/betterer#BettererFileTest.only | `only`}, and {@link @betterer/betterer#BettererFileTest.skip | `skip`}.
 *
 * @example
 * ```typescript
 * import { regexp } from '@betterer/regexp';
 *
 * export default {
 *   'no hack comments': () => regexp(/(\/\/\s*HACK)/i).include('./src/*.ts')
 * };
 * ```
 */
export function regexp(pattern: RegExp): BettererFileTest {
  if (!pattern) {
    throw new BettererError('for `@betterer/regexp` to work, you need to provide a RegExp, e.g. `/^foo$/`. ❌');
  }

  return new BettererFileTest(async (filePaths, fileTestResult) => {
    if (!filePaths.length) {
      return;
    }

    pattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
    await Promise.all(
      filePaths.map(async (filePath) => {
        const fileText = await fs.readFile(filePath, 'utf8');
        const matches = getFileMatches(pattern, fileText);
        if (matches.length === 0) {
          return;
        }
        const file = fileTestResult.addFile(filePath, fileText);
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
