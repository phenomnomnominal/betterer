import { promises as fs } from 'fs';
import path from 'path';
import { BettererPackageJSON } from './types';

export async function getVersion(): Promise<string> {
  const packageJSONPath = path.resolve(__dirname, '../package.json');
  const cliPackageJSON = await fs.readFile(packageJSONPath, 'utf-8');
  const { version } = JSON.parse(cliPackageJSON) as BettererPackageJSON;
  return version;
}
