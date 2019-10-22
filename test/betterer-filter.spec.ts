import * as fs from 'fs';
import * as path from 'path';
import stripAnsi from 'strip-ansi';
import { promisify } from 'util';

import { start } from '../packages/cli/src';
import { DEFAULT_RESULTS_PATH } from '../packages/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-betterer-filter');

const deleteFile = promisify(fs.unlink);

const ARGV = ['node', './bin/betterer'];

describe('betterer init', () => {
  it('should initialise betterer in a repo', async () => {
    jest.setTimeout(10000);

    const logs: Array<string> = [];
    jest.spyOn(console, 'log').mockImplementation((...messages) => {
      logs.push(...messages.map(m => stripAnsi(m)));
    });

    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);

    await reset(resultsPath);

    const firstRun = await start(FIXTURE, ARGV);

    expect(firstRun.ran).toEqual(['test 1', 'test 2', 'test 3']);

    const secondRun = await start(FIXTURE, [...ARGV, '--filter', '1']);

    expect(secondRun.ran).toEqual(['test 1']);

    const thirdRun = await start(FIXTURE, [
      ...ARGV,
      '--filter',
      '1',
      '--filter',
      '3'
    ]);

    expect(thirdRun.ran).toEqual(['test 1', 'test 3']);

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
