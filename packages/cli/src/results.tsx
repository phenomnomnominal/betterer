import { BettererOptionsResults } from '@betterer/betterer';
import { React, render } from '@betterer/render';
import { Command } from 'commander';

import { resultsCommand, setEnv } from './options';
import { getRenderOptions } from './render';
import { Results } from './results/results';
import { BettererCLIResultsConfig } from './types';

/**
 * Run the **Betterer** `results` command to see the status of the {@link @betterer/betterer#BettererTest | `BettererTest`s}
 * in a project.
 */
export function results(cwd: string): Command {
  const command = resultsCommand();
  command.description();
  command.action(async (config: BettererCLIResultsConfig, command: Command): Promise<void> => {
    setEnv(config);

    // Mark options as unknown...
    const options: unknown = {
      configPaths: config.config,
      cwd,
      excludes: config.exclude,
      filters: config.filter,
      includes: command.args,
      resultsPath: config.results
    };

    try {
      // And then cast to BettererOptionsResults. This is possibly invalid,
      // but it's nicer to do the options validation in @betterer/betterer
      const app = render(
        <Results options={options as BettererOptionsResults} logo={config.logo} />,
        getRenderOptions()
      );
      await app.waitUntilExit();
    } catch {
      process.exitCode = 1;
    }
  });
  return command;
}
