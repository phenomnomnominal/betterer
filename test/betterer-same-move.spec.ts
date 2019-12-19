import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

import { betterer } from '@betterer/betterer/src';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from '@betterer/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-betterer-same-move');

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

describe('betterer', () => {
  it('should stay the same when a file is moved', async () => {
    jest.setTimeout(100000);

    const logs: Array<string> = [];
    jest.spyOn(console, 'log').mockImplementation((...messages) => {
      logs.push(...messages.map(m => stripAnsi(m)));
    });

    const configPaths = [path.resolve(FIXTURE, DEFAULT_CONFIG_PATH)];
    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);
    const indexPath = path.resolve(FIXTURE, './src/index.ts');
    const movedPath = path.resolve(FIXTURE, './src/moved.ts');

    await reset(resultsPath, indexPath, movedPath);

    await writeFile(
      indexPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`,
      'utf8'
    );

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(
      movedPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`,
      'utf8'
    );
    await deleteFile(indexPath);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset(resultsPath, indexPath, movedPath);
  });
});

async function reset(
  resultsPath: string,
  indexPath: string,
  movedPath: string
): Promise<void> {
  try {
    await deleteFile(resultsPath);
  } catch {
    // Moving on
  }
  try {
    await deleteFile(movedPath);
  } catch {
    // Moving on
  }
  try {
    await deleteFile(indexPath);
  } catch {
    // Moving on
  }
}
