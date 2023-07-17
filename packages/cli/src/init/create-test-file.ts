import type { BettererLogger } from '@betterer/logger';

import { BettererError } from '@betterer/errors';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const TEMPLATE_JS = `module.exports = {
  // Add tests here ☀️
};
`;
const TEMPLATE_TS = `export default {
  // Add tests here ☀️
};
`;

export async function run(logger: BettererLogger, cwd: string, configPath: string, ts: boolean): Promise<void> {
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
    const template = ts ? TEMPLATE_TS : TEMPLATE_JS;
    await fs.writeFile(configPath, template, 'utf8');
    await logger.success(`created "${configPath}"!`);
  } catch {
    throw new BettererError(`could not create "${configPath}".`);
  }
}
