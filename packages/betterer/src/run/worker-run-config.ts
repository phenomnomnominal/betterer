import { BettererConfig } from '../config';
import { BettererWorkerRunConfig } from './types';

export function createWorkerConfig(config: BettererConfig): BettererWorkerRunConfig {
  return {
    cache: config.cache,
    cachePath: config.cachePath,
    ci: config.ci,
    configPaths: config.configPaths,
    cwd: config.cwd,
    filePaths: config.filePaths,
    filters: config.filters,
    ignores: config.ignores,
    precommit: config.precommit,
    resultsPath: config.resultsPath,
    strict: config.strict,
    tsconfigPath: config.tsconfigPath,
    update: config.update,
    watch: config.watch
  };
}
