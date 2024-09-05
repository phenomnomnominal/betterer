import type { BettererTestMap, BettererTestsMeta } from './types.js';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { importDefault } from '../../fs/import.js';

export async function loadTestMetaFromConfig(configPath: string): Promise<BettererTestsMeta> {
  try {
    const exports = (await importDefault(configPath)) as BettererTestMap;
    return Object.keys(exports).map((name) => ({ configPath, name }));
  } catch (error) {
    throw new BettererError(`could not import config from "${configPath}". 😔`, error as BettererError);
  }
}

exposeToMainΔ({
  loadTestMetaFromConfig
});
