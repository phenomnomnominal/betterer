import type { BettererOptions } from '@betterer/betterer';
import type { Command } from 'commander';

import type { BettererCLIConfig } from './types.js';

import { betterer } from '@betterer/betterer';

import { cliCommand } from './options.js';
import { BettererCommand } from './types.js';

/**
 * Run **Betterer** in the default mode.
 */
export function start(cwd: string, ci: boolean): Command {
  const command = cliCommand(BettererCommand.start);
  command.description('run Betterer');
  command.action(async (config: BettererCLIConfig, command: Command): Promise<void> => {
    // Mark options as unknown...
    const options: unknown = {
      cache: config.cache,
      cachePath: config.cachePath,
      configPaths: config.config,
      ci,
      cwd,
      excludes: config.exclude,
      filters: config.filter,
      includes: command.args,
      logo: config.logo,
      reporters: config.reporter,
      resultsPath: config.results,
      silent: config.silent,
      strict: config.strict,
      tsconfigPath: config.tsconfig,
      update: config.update,
      workers: config.workers
    };

    try {
      // And then cast to BettererOptions. This is possibly invalid,
      // but it's nicer to do the options validation in @betterer/betterer
      const suiteSummary = await betterer(options as BettererOptions);
      if (suiteSummary.worse.length > 0 || suiteSummary.failed.length > 0) {
        process.exitCode = 1;
      }
    } catch {
      process.exitCode = 1;
    }
  });
  return command;
}
