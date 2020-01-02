import * as stack from 'callsite';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { promisify } from 'util';

import {
  BettererFileInfo,
  FileBetterer,
  createFileBetterer
} from '@betterer/betterer';

const globAsync = promisify(glob);

export function regexpBetterer(
  globs: string | ReadonlyArray<string>,
  regexp: RegExp
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const globsArray = Array.isArray(globs) ? globs : [globs];
  const resolvedGlobs = globsArray.map(glob => path.resolve(cwd, glob));

  return createFileBetterer(async (files: ReadonlyArray<string> = []) => {
    regexp = new RegExp(
      regexp.source,
      regexp.flags.includes('g') ? regexp.flags : `${regexp.flags}g`
    );

    const testFiles = [...files];
    if (testFiles.length === 0) {
      await Promise.all(
        resolvedGlobs.flatMap(async currentGlob => {
          const globFiles = await globAsync(currentGlob);
          testFiles.push(...globFiles);
        })
      );
    }

    const matches = await Promise.all(
      testFiles.flatMap(async filePath => {
        return await getFileMatches(regexp, filePath);
      })
    );
    return matches.flat();
  });
}

async function getFileMatches(
  regexp: RegExp,
  filePath: string
): Promise<ReadonlyArray<BettererFileInfo>> {
  const matches: Array<BettererFileInfo> = [];
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
      const [matchText] = currentMatch;
      matches.push({
        message: `RegExp match`,
        filePath,
        fileText,
        start: currentMatch.index,
        end: currentMatch.index + matchText.length
      });
    }
  } while (currentMatch);
  return matches;
}
