import { BettererError } from '@betterer/errors';
import { BettererTaskContext, BettererTaskLogger } from '@betterer/logger';
import { promises as fs } from 'fs';

const TEMPLATE = `export default {
  // Add tests here ☀️
};`;

export function createTestFile(configPath: string): BettererTaskContext {
  return {
    name: 'Create test file',
    run: (logger) => runCreateTestFile(logger, configPath)
  };
}

async function runCreateTestFile(logger: BettererTaskLogger, configPath: string): Promise<void> {
  logger.status(`creating "${configPath}" file...`);

  let exists = false;
  try {
    exists = !!(await fs.readFile(configPath));
  } catch {
    // Doesn't matter if it fails...
  }

  if (exists) {
    logger.warn(`"${configPath}" already exists, moving on...`);
    return;
  }

  try {
    await fs.writeFile(configPath, TEMPLATE, 'utf8');
    logger.info(`created "${configPath}"!`);
  } catch {
    throw new BettererError(`could not read "${configPath}".`);
  }
}
