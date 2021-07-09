import { BettererError } from '@betterer/errors';
import { BettererConfig } from '../config';

import { requireUncached } from '../require';
import { isFunction } from '../utils';
import { BettererTestMap, BettererTestMetaMap } from './types';

export function loadTests(config: BettererConfig): BettererTestMetaMap {
  let tests: BettererTestMetaMap = {};
  config.configPaths.map((configPath) => {
    tests = { ...tests, ...loadTestsFromConfig(configPath) };
  });
  return tests;
}

function loadTestsFromConfig(configPath: string): BettererTestMetaMap {
  try {
    const tests: BettererTestMetaMap = {};
    const exports = requireUncached<BettererTestMap>(configPath);
    Object.keys(exports).forEach((name) => {
      const factory = exports[name];
      if (!isFunction(factory)) {
        throw new BettererError(`"${name}" must be a function.`);
      }
      tests[name] = { name, configPath, factory };
    });
    return tests;
  } catch (e) {
    throw new BettererError(`could not read config from "${configPath}". 😔`, e);
  }
}
