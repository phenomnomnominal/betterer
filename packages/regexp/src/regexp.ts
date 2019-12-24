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
import { error, info } from '@betterer/logger';

const globAsync = promisify(glob);

export function regexpBetterer(
  globs: string | Array<string>,
  regexp: RegExp
): FileBetterer {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const globsArray = Array.isArray(globs) ? globs : [globs];
  const resolvedGlobs = globsArray.map(glob => path.resolve(cwd, glob));

  return createFileBetterer(async (files: Array<string> = []) => {
    info(`using RegExp to find files matching "${regexp}"`);

    regexp = new RegExp(
      regexp.source,
      regexp.flags.includes('g') ? regexp.flags : `${regexp.flags}g`
    );

    const matches: Array<BettererFileInfo> = [];

    if (files.length === 0) {
      await Promise.all(
        resolvedGlobs.flatMap(async currentGlob => {
          const globFiles = await globAsync(currentGlob);
          files.push(...globFiles);
        })
      );
    }

    await Promise.all(
      files.map(async filePath => {
        const fileErrors = await getFileMatches(regexp, filePath);
        matches.push(...fileErrors);
      })
    );

    if (matches.length) {
      error('RegExp found some matches:');
    }

    return matches;
  });
}

async function getFileMatches(
  regexp: RegExp,
  filePath: string
): Promise<Array<BettererFileInfo>> {
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
