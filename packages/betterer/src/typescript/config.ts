import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigTypeScript, BettererOptionsTypeScript } from './types.js';

import path from 'node:path';

import { validateFilePath } from '../config/index.js';

export async function createTypeScriptConfig(
  configFS: BettererConfigFS,
  options: BettererOptionsTypeScript
): Promise<BettererConfigTypeScript> {
  let tsconfigPath = options.tsconfigPath || null;

  if (tsconfigPath) {
    tsconfigPath = path.resolve(configFS.cwd, tsconfigPath);
    await validateFilePath({ tsconfigPath });
  }

  return { tsconfigPath };
}
