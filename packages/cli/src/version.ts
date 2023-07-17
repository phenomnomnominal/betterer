import type { BettererPackageJSON } from './types.js';

import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function getVersion(): Promise<string> {
  const packageJSONPath = path.resolve(__dirname, '../package.json');
  const cliPackageJSON = await fs.readFile(packageJSONPath, 'utf-8');
  const { version } = JSON.parse(cliPackageJSON) as BettererPackageJSON;
  return version;
}
