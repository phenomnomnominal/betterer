import { BettererError } from '@betterer/errors';
import { BettererTaskLoggerAsync } from '@betterer/logger';
import { promises as fs } from 'fs';

const TEMPLATE = `export default {
  // Add tests here ☀️
};`;

export async function run(logger: BettererTaskLoggerAsync, configPath: string): Promise<void> {
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
    await fs.writeFile(configPath, TEMPLATE, 'utf8');
    await logger.info(`created "${configPath}"!`);
  } catch {
    throw new BettererError(`could not read "${configPath}".`);
  }
}
