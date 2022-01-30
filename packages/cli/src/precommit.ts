import { betterer, BettererOptionsStart } from '@betterer/betterer';
import { Command } from 'commander';

import { cliCommand, setEnv } from './options';
import { BettererCLIConfig, BettererCommand } from './types';

/**
 * Run **Betterer** in `precommit` mode.
 */
export function precommit(cwd: string): Command {
  const command = cliCommand(BettererCommand.precommit);
  command.description('run Betterer in precommit mode');
  command.action(async (config: BettererCLIConfig, command: Command): Promise<void> => {
    setEnv(config);

    // Mark options as unknown...
    const options: unknown = {
      cache: config.cache,
      cachePath: config.cachePath,
      configPaths: config.config,
      cwd,
      excludes: config.exclude,
      filters: config.filter,
      includes: command.args,
      precommit: true,
      reporters: config.reporter,
      resultsPath: config.results,
      silent: config.silent,
      tsconfigPath: config.tsconfig,
      workers: config.workers
    };

    try {
      // And then cast to BettererOptionsStart. This is possibly invalid,
      // but it's nicer to do the options validation in @betterer/betterer
      const suiteSummary = await betterer(options as BettererOptionsStart);
      if (suiteSummary.worse.length > 0 || suiteSummary.failed.length > 0) {
        process.exitCode = 1;
      }
    } catch {
      process.exitCode = 1;
    }
  });

  return command;
}
