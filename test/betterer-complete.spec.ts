import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

import { betterer } from '@betterer/betterer/src';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from '@betterer/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-betterer-complete');

const deleteFile = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

describe('betterer', () => {
  it(`should work when a test meets its goal`, async () => {
    jest.setTimeout(10000);

    const logs: Array<string> = [];
    jest.spyOn(console, 'log').mockImplementation((...messages) => {
      logs.push(...messages.map(m => stripAnsi(m)));
    });

    const configPaths = [path.resolve(FIXTURE, DEFAULT_CONFIG_PATH)];
    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);

    await reset(resultsPath);

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['gets completed']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['gets completed']);

    const thirdRun = await betterer({ configPaths, resultsPath });

    expect(thirdRun.completed).toEqual(['gets completed']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath, 'utf8');

    expect(result).toMatchSnapshot();

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
