import * as path from 'path';

import { isString, isUndefined } from '../utils';
import { BettererConfig, BettererConfigPartial } from './types';

const DEFAULT_CONFIG_PATH = './.betterer';
const DEFAULT_RESULTS_PATH = `./.betterer.results`;

export function createConfig(partialConfig: BettererConfigPartial): BettererConfig {
  const { cwd } = partialConfig;
  const configPaths = toArray<string>(partialConfig.configPaths || [DEFAULT_CONFIG_PATH]).map(configPath =>
    path.resolve(cwd, configPath)
  );
  const filters = toRegExps(toArray(partialConfig.filters));
  const ignores = toRegExps(toArray(partialConfig.ignores));
  const resultsPath = path.resolve(cwd, partialConfig.resultsPath || DEFAULT_RESULTS_PATH);

  return {
    configPaths,
    filters,
    ignores,
    resultsPath
  };
}

function toArray<T>(value: unknown): Array<T> {
  return Array.isArray(value) ? value : isUndefined(value) ? [] : [value];
}

function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
