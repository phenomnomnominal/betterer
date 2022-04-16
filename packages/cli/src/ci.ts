import { betterer, BettererOptionsStart } from '@betterer/betterer';
import { Command } from 'commander';

import { cliCommand } from './options';
import { BettererCLIConfig, BettererCommand } from './types';

/**
 * Run **Betterer** in `ci` mode.
 */
export function ci(cwd: string): Command {
  const command = cliCommand(BettererCommand.ci);
  command.description('run Betterer in CI mode');
  command.action(async (config: BettererCLIConfig, command: Command): Promise<void> => {
    // Mark options as unknown...
    const options: unknown = {
      cache: config.cache,
      cachePath: config.cachePath,
      ci: true,
      configPaths: config.config,
      cwd,
      excludes: config.exclude,
      filters: config.filter,
      includes: command.args,
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
      if (suiteSummary.changed.length > 0 || suiteSummary.failed.length > 0) {
        process.exitCode = 1;
      }
    } catch {
      process.exitCode = 1;
    }
  });

  return command;
}
