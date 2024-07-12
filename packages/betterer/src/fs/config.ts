import type { BettererConfigFS, BettererConfigMerge, BettererOptionsFS, BettererOptionsMerge } from './types.js';

import path from 'node:path';

import { BettererError } from '@betterer/errors';

import { toArray, validateBool, validateFilePath, validateString, validateStringArray } from '../config/index.js';

const BETTERER_CACHE = './.betterer.cache';
const BETTERER_RESULTS = './.betterer.results';
const BETTERER_TS = './.betterer.ts';

export async function createFSConfig(options: BettererOptionsFS): Promise<BettererConfigFS> {
  const cache = !!options.cachePath || options.cache || false;
  const cachePath = options.cachePath || BETTERER_CACHE;

  const cwd = options.cwd || process.cwd();
  const configPaths = options.configPaths ? toArray<string>(options.configPaths) : [BETTERER_TS];
  const validatedConfigPaths = await validateConfigPaths(cwd, configPaths);

  const resultsPath = options.resultsPath || BETTERER_RESULTS;

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
  const resultsPath = path.resolve(cwd, options.resultsPath || BETTERER_RESULTS);

  validateStringArray({ contents });
  validateString({ cwd });
  await validateFilePath({ resultsPath });

  return {
    contents,
    cwd,
    resultsPath: path.resolve(cwd, resultsPath)
  };
}

const JS_EXTENSIONS = ['.js', '.cjs', '.mjs'];
const TS_EXTENSIONS = ['.ts', '.tsx', '.cts', '.ctsx', '.mtx', '.mtsx'];
const IMPORT_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

async function validateConfigPaths(cwd: string, configPaths: Array<string>): Promise<Array<string>> {
  return await Promise.all(
    configPaths.map(async (configPath) => {
      const absoluteConfigPath = path.resolve(cwd, configPath);
      const { dir, name, ext } = path.parse(absoluteConfigPath);

      if (ext) {
        try {
          await validateFilePath({ absoluteConfigPath });
          return absoluteConfigPath;
        } catch {
          // Need to try other extensions
        }
      }

      try {
        return await Promise.any(
          IMPORT_EXTENSIONS.map(async (importExt) => {
            const possibleConfigPath = path.join(dir, `${name}${importExt}`);
            await validateFilePath({ possibleConfigPath });
            return possibleConfigPath;
          })
        );
      } catch {
        throw new BettererError(`could not find config file at "${absoluteConfigPath}". 😔`);
      }
    })
  );
}
