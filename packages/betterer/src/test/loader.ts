import type { BettererConfigPaths } from '../fs/index.js';
import type { BettererTestMap, BettererTestFactoryMetaMap } from './types.js';

import { BettererError } from '@betterer/errors';

import { isFunction } from '../utils.js';
import { importDefault } from '../fs/import.js';

export function loadTestMeta(configPaths: BettererConfigPaths): BettererTestFactoryMetaMap {
  let testMetaMap: BettererTestFactoryMetaMap = {};
  configPaths.map((configPath) => {
    const testMeta = loadTestMetaFromConfig(configPath);
    testMetaMap = { ...testMetaMap, ...testMeta };
  });
  return testMetaMap;
}

function loadTestMetaFromConfig(configPath: string): BettererTestFactoryMetaMap {
  try {
    const testMeta: BettererTestFactoryMetaMap = {};
    const exports = importDefault<BettererTestMap>(configPath);
    Object.keys(exports).forEach((name) => {
      const factory = exports[name];
      if (!isFunction(factory)) {
        throw new BettererError(`"${name}" must be a function.`);
      }
      testMeta[name] = { name, configPath, factory };
    });
    return testMeta;
  } catch (error) {
    debugger;
    throw new BettererError(`could not import config from "${configPath}". 😔`, error as BettererError);
  }
}
