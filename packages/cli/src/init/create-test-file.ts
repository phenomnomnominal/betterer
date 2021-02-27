import { BettererError } from '@betterer/errors';
import { BettererLogger } from '@betterer/logger';
import { promises as fs } from 'fs';

const TEMPLATE_JS = `module.exports = {
  // Add tests here ☀️
};
`;
const TEMPLATE_TS = `export default {
  // Add tests here ☀️
};
`;

export async function run(logger: BettererLogger, configPath: string, ts: boolean): Promise<void> {
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
    await logger.info(`created "${configPath}"!`);
  } catch {
    throw new BettererError(`could not read "${configPath}".`);
  }
}
