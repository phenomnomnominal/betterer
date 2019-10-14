import * as stack from 'callsite';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { promisify } from 'util';

import { Betterer } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
import { code, error, info, LoggerCodeInfo } from '@betterer/logger';

const globAsync = promisify(glob);
const readAsync = promisify(fs.readFile);

export function regexpBetterer(
  files: string | Array<string>,
  regexp: RegExp
): Betterer<number> {
  const [, callee] = stack();
  const cwd = path.dirname(callee.getFileName());
  const filesArray = Array.isArray(files) ? files : [files];
  const filesGlobs = filesArray.map(glob => path.resolve(cwd, glob));

  return {
    test: async (): Promise<number> =>
      await createRegExpTest(filesGlobs, regexp),
    constraint: smaller,
    goal: 0
  };
}

async function createRegExpTest(
  globs: Array<string>,
  regexp: RegExp
): Promise<number> {
  info(`using RegExp to find files matching "${regexp}"`);

  regexp = new RegExp(regexp.source, `${regexp.flags}g`);

  const matches: Array<LoggerCodeInfo> = [];
  await Promise.all(
    globs.map(async currentGlob => {
      const filePaths = await globAsync(currentGlob);
      return Promise.all(
        filePaths.map(async filePath => {
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
              matches.push({
                message: `RegExp match:`,
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

  if (matches.length) {
    error(`found ${matches.length} RegExp matches:`);
    const matchesPerFile: Record<string, Array<LoggerCodeInfo>> = {};
    matches.forEach(match => {
      matchesPerFile[match.filePath] = matchesPerFile[match.filePath] || [];
      matchesPerFile[match.filePath].push(match);
    });
    Object.keys(matchesPerFile).forEach(filePathInfo => {
      error(`"${filePathInfo}":`);
      matchesPerFile[filePathInfo].forEach(match => code(match));
    });
  }
  return matches.length;
}
