import type { BettererConfigContext } from './../context/index.js';
import type {
  BettererConfigFS,
  BettererConfigPaths,
  BettererOptionsFS,
  BettererOptionsWatcher,
  BettererOptionsWatcherOverride
} from './types.js';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { BettererError, invariantΔ } from '@betterer/errors';

import {
  toArray,
  validateBool,
  validateDirectory,
  validateFilePath,
  validateString,
  validateStringArray
} from '../config/index.js';
import { getGlobals } from '../globals.js';
import { normalisedPath } from '../utils.js';

const BETTERER_CACHE = './.betterer.cache';
const BETTERER_RESULTS = './.betterer.results';
const BETTERER_TS = './.betterer.ts';

export async function createFSConfig(
  configContext: BettererConfigContext,
  options: BettererOptionsFS,
  optionsWatcher: BettererOptionsWatcher
): Promise<BettererConfigFS> {
  const cache = (!!options.cachePath || options.cache) ?? false;
  const cachePath = options.cachePath ?? BETTERER_CACHE;

  const cwd = options.cwd ?? process.cwd();
  const configPaths = options.configPaths ? toArray<string>(options.configPaths) : [BETTERER_TS];
  validateStringArray({ configPaths });
  const validatedConfigPaths = await validateConfigPaths(cwd, configPaths);

  const ignores = toArray<string>(optionsWatcher.ignores);
  const watch = optionsWatcher.watch ?? false;

  const resultsPath = options.resultsPath ?? BETTERER_RESULTS;
  const [configPath] = validatedConfigPaths;

  const basePath = options.basePath ? resolvePath(cwd, options.basePath) : normalisedPath(path.dirname(configPath));
  await validateDirectory({ basePath });

  const repoPath = options.repoPath ? resolvePath(cwd, options.repoPath) : basePath;
  await validateDirectory({ repoPath });

  validateString({ cwd });
  validateBool({ cache });
  validateStringArray({ cachePath });
  validateStringArray({ resultsPath });

  const gitPath = configContext.precommit ? await validateGitRepo(repoPath) : null;

  validateStringArray({ ignores });
  validateBool({ watch });

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated and will be removed in V7
  const tsconfigPath = options.tsconfigPath ?? null;

  return {
    basePath,
    cache,
    cachePath: resolvePath(cwd, cachePath),
    cwd,
    configPaths: validatedConfigPaths,
    ignores,
    repoPath,
    resultsPath: resolvePath(cwd, resultsPath),
    tsconfigPath: tsconfigPath != null ? path.resolve(cwd, tsconfigPath) : null,
    versionControlPath: gitPath ?? null,
    watch
  };
}

export function overrideWatchConfig(optionsOverride: BettererOptionsWatcherOverride): void {
  if (optionsOverride.ignores) {
    const { config } = getGlobals();
    validateStringArray({ ignores: optionsOverride.ignores });
    config.ignores = toArray<string>(optionsOverride.ignores);
  }
}

const JS_EXTENSIONS = ['.js', '.cjs', '.mjs'];
const TS_EXTENSIONS = ['.ts', '.tsx', '.cts', '.ctsx', '.mtx', '.mtsx'];
const IMPORT_EXTENSIONS = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

function resolvePath(cwd: string, filePath: string): string {
  return normalisedPath(path.resolve(cwd, filePath));
}

async function validateConfigPaths(cwd: string, configPaths: Array<string>): Promise<BettererConfigPaths> {
  const validatedConfigPaths = await Promise.all(
    configPaths.map(async (configPath) => {
      const absoluteConfigPath = resolvePath(cwd, configPath);
      const { dir, name, ext } = path.parse(absoluteConfigPath);

      if (ext) {
        try {
          await validateFilePath({ absoluteConfigPath });
          return absoluteConfigPath;
        } catch {
          // Handle missing extension below
        }
      }

      try {
        return await Promise.any(
          IMPORT_EXTENSIONS.map(async (importExt) => {
            const possibleConfigPath = resolvePath(dir, `${name}${importExt}`);
            await validateFilePath({ possibleConfigPath });
            return possibleConfigPath;
          })
        );
      } catch (error) {
        throw new BettererError(`could not find config file at "${absoluteConfigPath}". 😔`, error as Error);
      }
    })
  );
  const [first, ...rest] = validatedConfigPaths.filter(Boolean);
  invariantΔ(first, 'the existence of at least one config path should have been validated!');
  return [first, ...rest];
}

async function validateGitRepo(repoPath: string): Promise<string> {
  try {
    const gitPath = path.join(repoPath, '.git');
    await fs.access(gitPath);
    return repoPath;
  } catch {
    throw new BettererError(
      `".git" directory not found in "${repoPath}". Precommit mode only works within a Git repository.`
    );
  }
}
