import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

import { betterer } from '@betterer/betterer/src';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from '@betterer/cli/src/constants';

const FIXTURE = path.resolve(
  __dirname,
  '../fixtures/test-betterer-eslint-complex'
);

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

describe('betterer', () => {
  it('should report the status of a new eslint rule with a complex set up', async () => {
    jest.setTimeout(100000);

    const logs: Array<string> = [];
    jest.spyOn(console, 'log').mockImplementation((...messages) => {
      logs.push(...messages.map(m => stripAnsi(m)));
    });

    const configPaths = [path.resolve(FIXTURE, DEFAULT_CONFIG_PATH)];
    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);
    const indexPath = path.resolve(FIXTURE, './src/index.ts');

    await reset(resultsPath);

    await writeFile(indexPath, `debugger;`, 'utf8');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['eslint enable no-debugger rule']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['eslint enable no-debugger rule']);

    await writeFile(indexPath, `debugger;\ndebugger;`, 'utf8');

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['eslint enable no-debugger rule']);

    const result = await readFile(resultsPath, 'utf8');

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``, 'utf8');

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['eslint enable no-debugger rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual([
      'eslint enable no-debugger rule'
    ]);

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
