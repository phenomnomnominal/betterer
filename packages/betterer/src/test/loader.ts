import type { BettererConfigPaths } from '../config/index.js';
import type { BettererTestMap, BettererTestFactoryMetaMap } from './types.js';

import { BettererError } from '@betterer/errors';

import { importDefault } from '../import.js';
import { isFunction } from '../utils.js';

export async function loadTestMeta(configPaths: BettererConfigPaths): Promise<BettererTestFactoryMetaMap> {
  let testMetaMap: BettererTestFactoryMetaMap = {};
  await Promise.all(
    configPaths.map(async (configPath) => {
      const testMeta = await loadTestMetaFromConfig(configPath);
      testMetaMap = { ...testMetaMap, ...testMeta };
    })
  );
  return testMetaMap;
}

async function loadTestMetaFromConfig(configPath: string): Promise<BettererTestFactoryMetaMap> {
  try {
    const testMeta: BettererTestFactoryMetaMap = {};
    const exports = await importDefault<BettererTestMap>(configPath);
    Object.keys(exports).forEach((name) => {
      const factory = exports[name];
      if (!isFunction(factory)) {
        throw new BettererError(`"${name}" must be a function.`);
      }
      testMeta[name] = { name, configPath, factory };
    });
    return testMeta;
  } catch (error) {
    throw new BettererError(`could not import config from "${configPath}". 😔`, error as BettererError);
  }
}
