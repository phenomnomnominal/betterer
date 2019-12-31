import { error, info, warn, success } from '@betterer/logger';
import * as commander from 'commander';
import * as findUp from 'find-up';
import { promises as fs } from 'fs';
import * as path from 'path';

import { DEFAULT_CONFIG_PATH } from './constants';

const TEMPLATE = `module.exports = {\n  // Add tests here ☀️\n};`;

export async function init(cwd: string, argv: Array<string>): Promise<void> {
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      `${DEFAULT_CONFIG_PATH}.ts`
    )
    .parse(argv);

  const { config } = commander;

  info('initialising betterer... ☀️');
  await createTestFile(cwd, config);
  await updatePackageJSON(cwd);
  success('initialised betterer! ☀️');
}

async function createTestFile(
  cwd: string,
  configFilePath: string
): Promise<void> {
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
    error(`couln't write to "${configPath}" 🔥`);
    return;
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
      throw new Error();
    }
    packageJSON = JSON.parse(await fs.readFile(packageJSONPath, 'utf-8'));
  } catch {
    error(`couldn't read package.json 🔥`);
    return;
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { version } = require('../package.json');
    packageJSON.devDependencies['@betterer/cli'] = `^${version}`;
  }

  try {
    await fs.writeFile(
      packageJSONPath,
      JSON.stringify(packageJSON, null, 2),
      'utf-8'
    );
  } catch {
    error(`couldn't write package.json 🔥`);
    return;
  }

  success(`added "betterer" to package.json file! 🎉`);
}
