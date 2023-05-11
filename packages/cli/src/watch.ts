import { betterer, BettererOptionsWatch } from '@betterer/betterer';
import { Command } from 'commander';

import { cliCommand, setEnv } from './options';
import { BettererCLIConfig, BettererCommand } from './types';

/**
 * Run **Betterer** in `watch` mode.
 */
export function watch(cwd: string): Command {
  const command = cliCommand(BettererCommand.watch);
  command.description('run Betterer in watch mode');
  command.action(async (config: BettererCLIConfig): Promise<void> => {
    setEnv(config);

    // Mark options as unknown...
    const options: unknown = {
      cache: config.cache,
      cachePath: config.cachePath,
      configPaths: config.config,
      cwd,
      filters: config.filter,
      ignores: config.ignore,
      logo: config.logo,
      reporters: config.reporter,
      resultsPath: config.results,
      silent: config.silent,
      strict: config.strict,
      tsconfigPath: config.tsconfig,
      update: config.update,
      workers: config.workers
    };

    // And then cast to BettererOptionsWatch. This is possibly invalid,
    // but it's nicer to do the options validation in @betterer/betterer
    await betterer.watch(options as BettererOptionsWatch);
  });
  return command;
}
