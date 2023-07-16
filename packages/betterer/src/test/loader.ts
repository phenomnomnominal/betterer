import type { BettererConfig } from '../config';
import type { BettererTestMap, BettererTestFactoryMetaMap } from './types';

import { BettererError } from '@betterer/errors';

import { requireUncached } from '../require';
import { isFunction } from '../utils';

export function loadTestMeta(config: BettererConfig): BettererTestFactoryMetaMap {
  let testMetaMap: BettererTestFactoryMetaMap = {};
  config.configPaths.map((configPath) => {
    const testMeta = loadTestMetaFromConfig(configPath);
    testMetaMap = { ...testMetaMap, ...testMeta };
  });
  return testMetaMap;
}

function loadTestMetaFromConfig(configPath: string): BettererTestFactoryMetaMap {
  try {
    const testMeta: BettererTestFactoryMetaMap = {};
    const exports = requireUncached<BettererTestMap>(configPath);
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
