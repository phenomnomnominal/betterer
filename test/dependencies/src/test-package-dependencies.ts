import { BettererError } from '@betterer/errors';
import { BettererLogger } from '@betterer/logger';
import dependencyCheck from 'dependency-check';
import { promises as fs } from 'fs';
import * as path from 'path';

const EXCLUDED_PACKAGES = ['docgen', 'extension', 'fixture'];
const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');

export async function getPackages(): Promise<Array<string>> {
  const items = await fs.readdir(PACKAGES_DIR);

  const testDirectory = await Promise.all(
    items.map(async (item) => {
      const stat = await fs.lstat(path.join(PACKAGES_DIR, item));
      return stat.isDirectory();
    })
  );

  const packages = items.filter((_, index) => testDirectory[index]);
  return packages.filter((packageName) => {
    return packageName && !EXCLUDED_PACKAGES.includes(packageName);
  });
}

export async function run(logger: BettererLogger, packageName: string): Promise<string> {
  const packageNameFull = `@betterer/${packageName}`;
  await logger.progress(`Validating dependencies for "${packageNameFull}" ...`);

  const parsed = await dependencyCheck({
    path: path.resolve(PACKAGES_DIR, packageName),
    entries: ['package.json']
  });
  const missing = await dependencyCheck.missing(parsed.package, parsed.used);

  if (!missing.length) {
    return `No missing dependencies found in "${packageNameFull}".`;
  }

  throw new BettererError(`Missing dependencies found in "${packageNameFull}": ${missing.join(', ')}`);
}
