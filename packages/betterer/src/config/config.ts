import * as path from 'path';

import { isString, isUndefined } from '../utils';
import { BettererConfig, BettererConfigPartial } from './types';

let baseConfig: BettererConfigPartial = {};
export function config(partialConfig: BettererConfigPartial): void {
  baseConfig = partialConfig;
}

export function createConfig(partialConfig: BettererConfigPartial): BettererConfig {
  const relativeConfig = {
    configPaths: toArray<string>(partialConfig.configPaths || baseConfig.configPaths || ['./.betterer']),
    filters: toRegExps(toArray(partialConfig.filters || baseConfig.filters)),
    ignores: toArray<string>(partialConfig.ignores || baseConfig.ignores),
    resultsPath: partialConfig.resultsPath || baseConfig.resultsPath || './.betterer.results',
    cwd: partialConfig.cwd || baseConfig.cwd || process.cwd(),
    update: partialConfig.update || baseConfig.update || false
  };

  return {
    ...relativeConfig,
    configPaths: relativeConfig.configPaths.map((configPath) => path.resolve(relativeConfig.cwd, configPath)),
    resultsPath: path.resolve(relativeConfig.cwd, relativeConfig.resultsPath)
  };
}

function toArray<T>(value: unknown): Array<T> {
  return Array.isArray(value) ? value : isUndefined(value) ? [] : [value];
}

function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
