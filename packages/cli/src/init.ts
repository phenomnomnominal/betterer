import { logError } from '@betterer/errors';
import { info, warn, success } from '@betterer/logger';
import * as commander from 'commander';
import * as findUp from 'find-up';
import { promises as fs } from 'fs';
import * as path from 'path';

import { configPath } from './options';

import {
  COULDNT_FIND_PACKAGE_JSON,
  COULDNT_READ_PACKAGE_JSON,
  COULDNT_WRITE_CONFIG_FILE,
  COULDNT_WRITE_PACKAGE_JSON,
} from './errors';
import { CLIArguments } from './types';

const TEMPLATE = `export default {
  // Add tests here ☀️
};`;

export async function init(cwd: string, argv: CLIArguments): Promise<void> {
  configPath(commander);

  commander.parse(argv as Array<string>);

  const { config } = commander;

  info('initialising betterer... ☀️');
  try {
    await createTestFile(cwd, config);
    await updatePackageJSON(cwd);
  } catch (e) {
    logError(e);
    throw e;
  }
  success('initialised betterer! ☀️');
}

async function createTestFile(cwd: string, configFilePath: string): Promise<void> {
  const configPath = path.resolve(cwd, configFilePath);
  info(`creating "${configPath}" file...`);

  let exists = false;
  try {
    exists = !!(await fs.readFile(configPath));
  } catch {
    // Doesn't matter if it fails...
  }

  if (exists) {
    warn(`"${configPath}" already exists, moving on... 🤔`);
    return;
  }

  try {
    await fs.writeFile(configPath, TEMPLATE, 'utf8');
  } catch {
    throw COULDNT_WRITE_CONFIG_FILE(configPath);
  }

  success(`created "${configPath}" file! 🎉`);
}

async function updatePackageJSON(cwd: string): Promise<void> {
  info(`adding "betterer" to package.json file...`);

  let packageJSON;
  let packageJSONPath;
  try {
    packageJSONPath = await findUp('package.json', { cwd });
    if (!packageJSONPath) {
      throw COULDNT_FIND_PACKAGE_JSON();
    }
    packageJSON = JSON.parse(await fs.readFile(packageJSONPath, 'utf-8'));
  } catch {
    throw COULDNT_READ_PACKAGE_JSON();
  }

  packageJSON.scripts = packageJSON.scripts || {};
  if (packageJSON.scripts.betterer) {
    warn(`"betterer" script already exists, moving on... 🤔`);
    return;
  } else {
    packageJSON.scripts.betterer = 'betterer';
  }

  packageJSON.devDependencies = packageJSON.devDependencies || {};
  if (packageJSON.devDependencies['@betterer/cli']) {
    warn(`"betterer" dependency already exists, moving on... 🤔`);
  } else {
    // HACK:
    // It's easier to use require than to try to get `await import`
    // to work right for the package.json...
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { version } = require('../package.json');
    packageJSON.devDependencies['@betterer/cli'] = `^${version}`;
  }

  try {
    await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2), 'utf-8');
  } catch {
    throw COULDNT_WRITE_PACKAGE_JSON();
  }

  success(`added "betterer" to package.json file! 🎉`);
}
