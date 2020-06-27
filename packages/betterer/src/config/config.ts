import { mute, unmute } from '@betterer/logger';
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
    resultsPath: partialConfig.resultsPath || baseConfig.resultsPath || './.betterer.results',
    filters: toRegExps(toArray(partialConfig.filters || baseConfig.filters)),
    ignores: toArray<string>(partialConfig.ignores || baseConfig.ignores),
    cwd: partialConfig.cwd || baseConfig.cwd || process.cwd(),
    silent: partialConfig.silent || baseConfig.silent || false,
    update: partialConfig.update || baseConfig.update || false
  };
  const tsconfigPath = partialConfig.tsconfigPath || baseConfig.tsconfigPath;

  relativeConfig.silent ? mute() : unmute();

  return {
    ...relativeConfig,
    configPaths: relativeConfig.configPaths.map((configPath) => path.resolve(relativeConfig.cwd, configPath)),
    resultsPath: path.resolve(relativeConfig.cwd, relativeConfig.resultsPath),
    tsconfigPath: tsconfigPath ? path.resolve(relativeConfig.cwd, tsconfigPath) : null
  };
}

function toArray<T>(value: unknown): Array<T> {
  return Array.isArray(value) ? value : isUndefined(value) ? [] : [value];
}

function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
