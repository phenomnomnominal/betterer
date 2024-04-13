import type { BettererOptions } from '@betterer/betterer';
import type { Command } from 'commander';

import type { BettererCLIConfig } from './types.js';

import { betterer } from '@betterer/betterer';

import { cliCommand, setEnv } from './options.js';
import { BettererCommand } from './types.js';

/**
 * Run **Betterer** in `ci` mode.
 */
export function ci(cwd: string): Command {
  const command = cliCommand(BettererCommand.ci);
  command.description('run Betterer in CI mode');
  command.action(async (config: BettererCLIConfig, command: Command): Promise<void> => {
    setEnv(config);

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
      // And then cast to BettererOptions. This is possibly invalid,
      // but it's nicer to do the options validation in @betterer/betterer
      const suiteSummary = await betterer(options as BettererOptions);
      if (suiteSummary.changed.length > 0 || suiteSummary.failed.length > 0) {
        process.exitCode = 1;
      }
    } catch {
      process.exitCode = 1;
    }
  });

  return command;
}
