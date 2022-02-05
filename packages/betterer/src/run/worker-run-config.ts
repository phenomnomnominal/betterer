import { BettererConfig, BettererWorkerRunConfig } from '../config';

export function createWorkerRunConfig(config: BettererConfig): BettererWorkerRunConfig {
  return {
    cache: config.cache,
    cachePath: config.cachePath,
    ci: config.ci,
    configPaths: config.configPaths,
    cwd: config.cwd,
    excludes: config.excludes,
    filters: config.filters,
    includes: config.includes,
    ignores: config.ignores,
    precommit: config.precommit,
    resultsPath: config.resultsPath,
    strict: config.strict,
    tsconfigPath: config.tsconfigPath,
    update: config.update,
    versionControlPath: config.versionControlPath,
    watch: config.watch,
    workers: config.workers
  };
}
