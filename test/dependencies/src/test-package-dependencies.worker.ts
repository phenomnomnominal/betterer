import type { BettererLogger } from '@betterer/logger';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dependencyCheck from 'dependency-check';

const EXCLUDED_PACKAGES = ['docgen', 'extension', 'fixture'];
const IGNORED: Record<string, Array<string>> = {
  render: ['bufferutil', 'utf-8-validate']
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  const removeBuiltIns = missing.filter((dependency) => !dependency.startsWith('node:'));
  const errors = removeBuiltIns.filter((dependency) => !IGNORED[packageName]?.includes(dependency));

  // Fight with race condition in Comlink 😡
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (!errors.length) {
    return `No missing dependencies found in "${packageNameFull}".`;
  }

  throw new BettererError(`Missing dependencies found in "${packageNameFull}": ${errors.join(', ')}`);
}

exposeToMainΔ({ getPackages, run });
