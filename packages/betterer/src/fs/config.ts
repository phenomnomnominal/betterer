import type { BettererConfigFS, BettererConfigMerge, BettererOptionsFS, BettererOptionsMerge } from './types.js';

import path from 'node:path';

import { BettererError } from '@betterer/errors';

import { toArray, validateBool, validateFilePath, validateString, validateStringArray } from '../config/index.js';

export function createFSConfig(options: BettererOptionsFS): BettererConfigFS {
  const cache = !!options.cachePath || options.cache || false;
  const cachePath = options.cachePath || './.betterer.cache';

  const cwd = options.cwd || process.cwd();
  const configPaths = options.configPaths ? toArray<string>(options.configPaths) : ['./.betterer'];
  const validatedConfigPaths = validateConfigPaths(cwd, configPaths);

  const resultsPath = options.resultsPath || './.betterer.results';

  validateString({ cwd });
  validateBool({ cache });
  validateStringArray({ cachePath });
  validateStringArray({ resultsPath });

  return {
    cache,
    cachePath: path.resolve(cwd, cachePath),
    cwd,
    configPaths: validatedConfigPaths,
    resultsPath: path.resolve(cwd, resultsPath)
  };
}

export async function createMergeConfig(options: BettererOptionsMerge): Promise<BettererConfigMerge> {
  const contents = toArray(options.contents);
  const cwd = options.cwd || process.cwd();
  const resultsPath = path.resolve(cwd, options.resultsPath || './.betterer.results');

  validateStringArray({ contents });
  validateString({ cwd });
  await validateFilePath({ resultsPath });

  return {
    contents,
    cwd,
    resultsPath: path.resolve(cwd, resultsPath)
  };
}

function validateConfigPaths(cwd: string, configPaths: Array<string>): Array<string> {
  return configPaths.map((configPath) => {
    const absoluteConfigPath = path.resolve(cwd, configPath);
    try {
      return require.resolve(absoluteConfigPath);
    } catch (error) {
      throw new BettererError(`could not find config file at "${absoluteConfigPath}". 😔`, error as Error);
    }
  });
}
