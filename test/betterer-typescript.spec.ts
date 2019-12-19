import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

import { betterer } from '@betterer/betterer/src';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from '@betterer/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-betterer-typescript');

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

describe('betterer', () => {
  it('should report the status of the TypeScript compiler', async () => {
    jest.setTimeout(100000);

    const logs: Array<string> = [];
    jest.spyOn(console, 'log').mockImplementation((...messages) => {
      logs.push(...messages.map(m => stripAnsi(m)));
    });

    const configPaths = [path.resolve(FIXTURE, DEFAULT_CONFIG_PATH)];
    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);
    const indexPath = path.resolve(FIXTURE, './src/index.ts');

    await reset(resultsPath);

    await writeFile(
      indexPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`,
      'utf8'
    );

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    await writeFile(
      indexPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one, one * a);`,
      'utf8'
    );

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['typescript use strict mode']);

    const result = await readFile(resultsPath, 'utf8');

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``, 'utf8');

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['typescript use strict mode']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset(resultsPath);
  });
});

async function reset(resultsPath: string): Promise<void> {
  try {
    await deleteFile(resultsPath);
  } catch {
    // Moving on, nothing to reset
  }
}
