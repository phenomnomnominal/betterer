import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { betterer } from '../packages/betterer/src';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from '../packages/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-eslint-betterer');

const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

describe('eslint betterer', () => {
  it('should report the status of a new eslint rule', async () => {
    jest.setTimeout(10000);

    const configPaths = [path.resolve(FIXTURE, DEFAULT_CONFIG_PATH)];
    const resultsPath = path.resolve(FIXTURE, DEFAULT_RESULTS_PATH);
    const indexPath = path.resolve(FIXTURE, './src/index.ts');

    await reset(resultsPath);

    await writeFile(indexPath, `debugger;`, 'utf8');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['eslint enable new rule']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['eslint enable new rule']);

    await writeFile(indexPath, `debugger;\ndebugger;`, 'utf8');

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['eslint enable new rule']);

    await writeFile(indexPath, ``, 'utf8');

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['eslint enable new rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['eslint enable new rule']);

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
