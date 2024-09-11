import type { BettererFilePath, BettererFilePaths } from '../../fs/types.js';
import type { BettererTestMap, BettererTestsMeta } from './types.js';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { importDefault } from '../../fs/import.js';

/** @knipignore part of worker API */
export async function loadTestsMeta(configPaths: BettererFilePaths): Promise<BettererTestsMeta> {
  const testsMetaForConfigs = await Promise.all(configPaths.map(async (configPath) => await loadTestMeta(configPath)));
  return testsMetaForConfigs.flat();
}

async function loadTestMeta(configPath: BettererFilePath): Promise<BettererTestsMeta> {
  try {
    const exports = (await importDefault(configPath)) as BettererTestMap;
    return Object.keys(exports).map((name) => ({ configPath, name }));
  } catch (error) {
    throw new BettererError(`could not import config from "${configPath}". 😔`, error as BettererError);
  }
}

exposeToMainΔ({
  loadTestsMeta
});
