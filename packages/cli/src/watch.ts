import { betterer } from '@betterer/betterer';
import commander from 'commander';

import { watchOptions } from './options';
import { BettererCLIArguments, BettererCLIWatchConfig } from './types';

export async function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  watchOptions(commander);

  commander.parse(argv as Array<string>);

  const {
    config,
    results,
    filter,
    ignore,
    reporter,
    silent,
    tsconfig
  } = (commander as unknown) as BettererCLIWatchConfig;

  const watcher = await betterer.watch({
    configPaths: config,
    cwd,
    filters: filter,
    ignores: ignore,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig
  });

  return new Promise((): void => {
    process.on('SIGINT', () => {
      void watcher.stop();
    });
  });
}
