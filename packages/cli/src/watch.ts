import { betterer } from '@betterer/betterer';
import commander from 'commander';

import { watchOptions } from './options';
import { BettererCLIArguments } from './types';

export async function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config, results, filter, ignore, reporter, silent, tsconfig } = watchOptions(commander, argv);

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
