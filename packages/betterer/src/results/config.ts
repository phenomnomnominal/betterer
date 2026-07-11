import type { BettererConfigFS } from '../fs/index.js';
import type {
  BettererConfigMerge,
  BettererConfigResults,
  BettererOptionsMerge,
  BettererOptionsResults,
  BettererResultsStrategy
} from './types.js';

import { BettererError } from '@betterer/errors';
import path from 'node:path';

import { toArray, validateFilePath, validateString, validateStringArray } from '../config/index.js';
import { resolvePath } from '../utils.js';

const BETTERER_RESULTS = './.betterer.results';
const BETTERER_RESULTS_DIR = './.betterer.results.d';
const BETTERER_RESULTS_STRATEGIES = [
  'file',
  'directory',
  'server'
] as const satisfies ReadonlyArray<BettererResultsStrategy>;

export async function createMergeConfig(options: BettererOptionsMerge): Promise<BettererConfigMerge> {
  const contents = toArray(options.contents);
  const cwd = options.cwd ?? process.cwd();
  const resultsPath = path.resolve(cwd, options.resultsPath ?? BETTERER_RESULTS);

  validateStringArray({ contents });
  validateString({ cwd });

  const willReadResultsFile = contents.length < 2;
  if (willReadResultsFile) {
    await validateFilePath({ resultsPath });
  }

  return { contents, cwd, resultsPath };
}

export async function createResultsConfig(
  configFS: BettererConfigFS,
  options: BettererOptionsResults
): Promise<BettererConfigResults> {
  const { basePath, cwd } = configFS;

  const resultsStrategy = options.resultsStrategy ?? 'file';
  validateResultsStrategy(resultsStrategy);

  if (options.resultsStrategy === 'directory') {
    const resultsDir = options.resultsDir ?? BETTERER_RESULTS_DIR;
    validateString({ resultsDir });
    const resolvedResultsDir = resolvePath(cwd, resultsDir);
    return {
      resultsStrategy: 'directory',
      resultsPath: null,
      resultsDir: resolvedResultsDir,
      resultsServerUrl: null,
      resultsBasePath: path.dirname(resolvedResultsDir)
    };
  }

  if (options.resultsStrategy === 'server') {
    const { resultsServerUrl } = options;
    validateString({ resultsServerUrl });
    return {
      resultsStrategy: 'server',
      resultsPath: null,
      resultsDir: null,
      resultsServerUrl,
      resultsBasePath: basePath
    };
  }

  const resultsPath = options.resultsPath ?? BETTERER_RESULTS;
  validateString({ resultsPath });
  const resolvedResultsPath = resolvePath(cwd, resultsPath);
  // The `'server'` strategy will await its endpoint here; resolved for now so the boundary is async.
  return await Promise.resolve({
    resultsStrategy: 'file',
    resultsPath: resolvedResultsPath,
    resultsDir: null,
    resultsServerUrl: null,
    resultsBasePath: path.dirname(resolvedResultsPath)
  });
}

export function isResultsPath(config: BettererConfigResults, itemPath: string): boolean {
  const resultsLocation = config.resultsPath ?? config.resultsDir;
  if (resultsLocation === null) {
    return false;
  }
  return itemPath === resultsLocation || itemPath.startsWith(`${resultsLocation}/`);
}

function validateResultsStrategy(value: unknown): void {
  if (!BETTERER_RESULTS_STRATEGIES.some((name) => name === value)) {
    throw new BettererError(
      `"resultsStrategy" must be one of ${BETTERER_RESULTS_STRATEGIES.map((name) => `\`${name}\``).join(', ')}. Received \`${JSON.stringify(value)}\`.`
    );
  }
}
