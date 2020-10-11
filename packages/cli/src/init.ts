import { logErrorΔ } from '@betterer/errors';
import { infoΔ, successΔ, warnΔ } from '@betterer/logger';
import commander from 'commander';
import findUp from 'find-up';
import { promises as fs } from 'fs';
import * as path from 'path';

import { initOptions } from './options';
import { BettererCLIArguments, BettererCLIInitConfig, BettererPackageJSON } from './types';

import {
  COULDNT_FIND_PACKAGE_JSON,
  COULDNT_READ_PACKAGE_JSON,
  COULDNT_WRITE_CONFIG_FILE,
  COULDNT_WRITE_PACKAGE_JSON
} from './errors';

const TEMPLATE = `export default {
  // Add tests here ☀️
};`;

export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  initOptions(commander);

  commander.parse(argv as Array<string>);

  const { config } = (commander as unknown) as BettererCLIInitConfig;

  infoΔ('initialising Betterer... ☀️');
  try {
    await createTestFile(cwd, config);
    await updatePackageJSON(cwd);
  } catch (e) {
    logErrorΔ(e);
    throw e;
  }
  successΔ('initialised Betterer! ☀️');
}

async function createTestFile(cwd: string, configFilePath: string): Promise<void> {
  const configPath = path.resolve(cwd, configFilePath);
  infoΔ(`creating "${configPath}" file...`);

  let exists = false;
  try {
    exists = !!(await fs.readFile(configPath));
  } catch {
    // Doesn't matter if it fails...
  }

  if (exists) {
    warnΔ(`"${configPath}" already exists, moving on... 🤔`);
    return;
  }

  try {
    await fs.writeFile(configPath, TEMPLATE, 'utf8');
  } catch {
    throw COULDNT_WRITE_CONFIG_FILE(configPath);
  }

  successΔ(`created "${configPath}" file! 🎉`);
}

async function updatePackageJSON(cwd: string): Promise<void> {
  infoΔ(`adding "betterer" to package.json file...`);

  let packageJSON;
  let packageJSONPath;
  try {
    packageJSONPath = await findUp('package.json', { cwd });
    if (!packageJSONPath) {
      throw COULDNT_FIND_PACKAGE_JSON();
    }
    packageJSON = JSON.parse(await fs.readFile(packageJSONPath, 'utf-8')) as BettererPackageJSON;
  } catch {
    throw COULDNT_READ_PACKAGE_JSON();
  }

  packageJSON.scripts = packageJSON.scripts || {};
  if (packageJSON.scripts.betterer) {
    warnΔ(`"betterer" script already exists, moving on... 🤔`);
    return;
  } else {
    packageJSON.scripts.betterer = 'betterer';
  }

  packageJSON.devDependencies = packageJSON.devDependencies || {};
  if (packageJSON.devDependencies['@betterer/cli']) {
    warnΔ(`"betterer" dependency already exists, moving on... 🤔`);
  } else {
    // HACK:
    // It's easier to use require than to try to get `await import`
    // to work right for the package.json...
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { version } = require('../package.json') as BettererPackageJSON;
    packageJSON.devDependencies['@betterer/cli'] = `^${version}`;
  }

  try {
    await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2), 'utf-8');
  } catch {
    throw COULDNT_WRITE_PACKAGE_JSON();
  }

  successΔ(`added "betterer" to package.json file! 🎉`);
}
