import { BettererError } from '@betterer/errors';
import { BettererConfig, BettererConfigFilters } from '../config';

import { requireUncached } from '../require';
import { isFunction } from '../utils';
import { isBettererFileTest } from './file-test';
import { isBettererTest } from './test';
import { BettererTestMap, BettererTestMetaMap } from './types';

export function loadTests(config: BettererConfig): BettererTestMetaMap {
  let tests: BettererTestMetaMap = {};
  config.configPaths.map((configPath) => {
    tests = { ...tests, ...loadTestsFromConfig(configPath) };
  });
  applyOnly(tests);
  applyFilters(tests, config.filters);
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
      const test = factory();
      if (!isBettererTest(test) && !isBettererFileTest(test)) {
        throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
      }
      const { isOnly, isSkipped } = test;
      tests[name] = { name, configPath, factory, isOnly, isSkipped };
    });
    return tests;
  } catch (e) {
    throw new BettererError(`could not read config from "${configPath}". 😔`, e);
  }
}

function applyOnly(testMetaMap: BettererTestMetaMap): void {
  const tests = Object.values(testMetaMap);
  const only = tests.find((test) => test.isOnly);
  if (only) {
    tests.forEach((test) => {
      if (!test.isOnly) {
        test.isSkipped = true;
      }
    });
  }
}

function applyFilters(tests: BettererTestMetaMap, filters: BettererConfigFilters) {
  // read `filters` here so that it can be updated by watch mode:
  if (filters.length) {
    Object.keys(tests).forEach((name) => {
      if (!filters.some((filter) => filter.test(name))) {
        tests[name].isSkipped = true;
      }
    });
  }
}
