import { BettererFileIssue, BettererFileIssues, BettererFileTest, BettererFileIssueMap } from '@betterer/betterer';
import * as stack from 'callsite';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { promisify } from 'util';

import { FILE_GLOB_REQUIRED, REGEXP_REQUIRED } from './errors';

export function regexpBetterer(globs: string | ReadonlyArray<string>, regexp: RegExp): BettererFileTest {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!regexp) {
    throw REGEXP_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const globsArray = Array.isArray(globs) ? globs : [globs];
  const resolvedGlobs = globsArray.map((glob) => path.resolve(cwd, glob));

  return new BettererFileTest(async (files) => {
    regexp = new RegExp(regexp.source, regexp.flags.includes('g') ? regexp.flags : `${regexp.flags}g`);

    const testFiles = [...files];
    if (testFiles.length === 0) {
      await Promise.all(
        resolvedGlobs.flatMap(async (currentGlob) => {
          const globFiles = await promisify(glob)(currentGlob);
          testFiles.push(...globFiles);
        })
      );
    }

    const matches = await Promise.all(
      testFiles.map(async (filePath) => {
        return await getFileMatches(regexp, filePath);
      })
    );

    return testFiles.reduce((fileInfoMap, filePath, index) => {
      fileInfoMap[filePath] = matches[index];
      return fileInfoMap;
    }, {} as BettererFileIssueMap<BettererFileIssue>);
  });
}

async function getFileMatches(regexp: RegExp, filePath: string): Promise<BettererFileIssues<BettererFileIssue>> {
  const matches: Array<RegExpExecArray> = [];
  let fileText: string;
  try {
    fileText = await fs.readFile(filePath, 'utf8');
  } catch {
    // Can't read file, move on;
    return [];
  }

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
