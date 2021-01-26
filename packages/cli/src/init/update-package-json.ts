import { BettererError } from '@betterer/errors';
import { BettererTaskLoggerAsync } from '@betterer/logger';
import findUp from 'find-up';
import { promises as fs } from 'fs';

import { BettererPackageJSON } from '../types';

export async function run(logger: BettererTaskLoggerAsync, cwd: string): Promise<void> {
  await logger.progress('adding "betterer" to package.json file...');

  let packageJSON;
  let packageJSONPath;
  try {
    packageJSONPath = await findUp('package.json', { cwd });
    if (!packageJSONPath) {
      throw new BettererError('could not find "package.json".');
    }
    packageJSON = JSON.parse(await fs.readFile(packageJSONPath, 'utf-8')) as BettererPackageJSON;
  } catch {
    throw new BettererError('could not read "package.json".');
  }

  packageJSON.scripts = packageJSON.scripts || {};
  if (packageJSON.scripts.betterer) {
    await logger.warn('"betterer" script already exists, moving on...');
  } else {
    packageJSON.scripts.betterer = 'betterer';
    await logger.info('added "betterer" script to package.json file.');
  }

  packageJSON.devDependencies = packageJSON.devDependencies || {};
  if (packageJSON.devDependencies['@betterer/cli']) {
    await logger.warn('"@betterer/cli" dependency already exists, moving on...');
  } else {
    // HACK:
    // It's easier to use require than to try to get `await import`
    // to work right for the package.json...
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { version } = require(packageJSONPath) as BettererPackageJSON;
    packageJSON.devDependencies['@betterer/cli'] = `^${version}`;
    await logger.info('added "@betterer/cli" dependency to package.json file');
  }

  try {
    await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2), 'utf-8');
  } catch {
    throw new BettererError('could not write "package.json".');
  }
}
