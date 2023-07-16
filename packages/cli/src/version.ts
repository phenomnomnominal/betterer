import type { BettererPackageJSON } from './types';

import { promises as fs } from 'fs';
import path from 'path';

export async function getVersion(): Promise<string> {
  const packageJSONPath = path.resolve(__dirname, '../package.json');
  const cliPackageJSON = await fs.readFile(packageJSONPath, 'utf-8');
  const { version } = JSON.parse(cliPackageJSON) as BettererPackageJSON;
  return version;
}
