import * as stack from 'callsite';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { promisify } from 'util';

import { BettererFileInfo, FileBetterer, createFileBetterer } from '@betterer/betterer';
import { FILE_GLOB_REQUIRED, REGEXP_REQUIRED } from './errors';

const globAsync = promisify(glob);
const readAsync = promisify(fs.readFile);

export function regexpBetterer(globs: string | Array<string>, regexp: RegExp): FileBetterer {
  if (!globs) {
    throw FILE_GLOB_REQUIRED();
  }
  if (!regexp) {
    throw REGEXP_REQUIRED();
  }

  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const filesArray = Array.isArray(globs) ? globs : [globs];
  const filesGlobs = filesArray.map((glob) => path.resolve(cwd, glob));

  return createFileBetterer(async () => {
    regexp = new RegExp(regexp.source, regexp.flags.includes('g') ? regexp.flags : `${regexp.flags}g`);

    const errors: Array<BettererFileInfo> = [];
    await Promise.all(
      filesGlobs.map(async (currentGlob) => {
        const filePaths = await globAsync(currentGlob);
        return Promise.all(
          filePaths.map(async (filePath) => {
            let fileText;
            try {
              fileText = await readAsync(filePath, 'utf8');
            } catch {
              // Can't read file, move on;
              return;
            }

            let currentMatch;
            do {
              currentMatch = regexp.exec(fileText);
              if (currentMatch) {
                const [matchText] = currentMatch;
                errors.push({
                  message: `RegExp match`,
                  filePath,
                  fileText,
                  start: currentMatch.index,
                  end: currentMatch.index + matchText.length
                });
              }
            } while (currentMatch);
          })
        );
      })
    );

    return errors;
  });
}
