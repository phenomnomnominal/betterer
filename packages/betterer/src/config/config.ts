import * as assert from 'assert';
import { muteΔ, unmuteΔ } from '@betterer/logger';
import * as path from 'path';

import { isString, isUndefined } from '../utils';
import { BettererConfig, BettererConfigPartial } from './types';

let globalConfig: BettererConfig | null = null;

export function createConfig(partialConfig: BettererConfigPartial = {}): BettererConfig {
  const relativeConfig = {
    allowDiff: partialConfig.allowDiff ?? true,
    configPaths: toArray<string>(partialConfig.configPaths || ['./.betterer']),
    resultsPath: partialConfig.resultsPath || './.betterer.results',
    filters: toRegExps(toArray<string | RegExp>(partialConfig.filters)),
    ignores: toArray<string>(partialConfig.ignores),
    cwd: partialConfig.cwd || process.cwd(),
    silent: partialConfig.silent || false,
    update: partialConfig.update || false,
    reporters: partialConfig.reporters || []
  };
  const tsconfigPath = partialConfig.tsconfigPath;

  relativeConfig.silent ? muteΔ() : unmuteΔ();

  globalConfig = {
    ...relativeConfig,
    configPaths: relativeConfig.configPaths.map((configPath) => path.resolve(relativeConfig.cwd, configPath)),
    resultsPath: path.resolve(relativeConfig.cwd, relativeConfig.resultsPath),
    tsconfigPath: tsconfigPath ? path.resolve(relativeConfig.cwd, tsconfigPath) : null
  };
  return getConfig();
}

export function getConfig(): BettererConfig {
  assert(globalConfig);
  return globalConfig;
}

function toArray<T>(value?: ReadonlyArray<T> | Array<T> | T): Array<T> {
  return Array.isArray(value) ? value : isUndefined(value) ? [] : [value as T];
}

function toRegExps(value: ReadonlyArray<string | RegExp>): ReadonlyArray<RegExp> {
  return value.map((v: string | RegExp) => (isString(v) ? new RegExp(v, 'i') : v));
}
