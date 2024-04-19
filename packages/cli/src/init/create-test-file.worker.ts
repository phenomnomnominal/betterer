import type { BettererLogger } from '@betterer/logger';

import { BettererError } from '@betterer/errors';
import { exposeToMain__ } from '@betterer/worker';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TEMPLATE_JS = `export default {
  // Add tests here ☀️
};
`;

export async function run(logger: BettererLogger, cwd: string, configPath: string): Promise<void> {
  configPath = path.resolve(cwd, configPath);

  await logger.progress(`creating "${configPath}" file...`);

  let exists = false;
  try {
    exists = !!(await fs.readFile(configPath));
  } catch {
    // Doesn't matter if it fails...
  }

  if (exists) {
    await logger.warn(`"${configPath}" already exists, moving on...`);
    return;
  }

  try {
    await fs.writeFile(configPath, TEMPLATE_JS, 'utf8');
    await logger.success(`created "${configPath}"!`);
  } catch {
    throw new BettererError(`could not create "${configPath}".`);
  }
}

exposeToMain__({ run });
