import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { init } from '../packages/cli/src';
import { DEFAULT_CONFIG_PATH } from '../packages/cli/src/constants';

const FIXTURE = path.resolve(__dirname, '../fixtures/test-betterer-init');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

describe('betterer init', () => {
  it('should setup betterer in a repo', async () => {
    jest.setTimeout(10000);

    const configPath = path.resolve(FIXTURE, DEFAULT_CONFIG_PATH);
    const packageJSONPath = path.resolve(FIXTURE, './package.json');

    await reset(configPath, packageJSONPath);

    await init(FIXTURE);

    const packageJSON = JSON.parse(await readFile(packageJSONPath, 'utf-8'));

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toBeDefined();

    const config = await readFile(configPath, 'utf-8');

    expect(config).toEqual('module.exports = {\n  // Add tests here ☀️\n};');

    await reset(configPath, packageJSONPath);
  });
});

async function reset(
  configPath: string,
  packageJSONPath: string
): Promise<void> {
  try {
    await deleteFile(configPath);
  } catch {
    // Moving on, nothing to reset
  }

  try {
    const packageJSON = JSON.parse(await readFile(packageJSONPath, 'utf-8'));
    delete packageJSON.scripts;
    delete packageJSON.devDependencies;
    const json = JSON.stringify(packageJSON, null, 2);
    await writeFile(packageJSONPath, json, 'utf-8');
  } catch {
    // Moving on, nothing to reset
  }
}
