import { betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { configPaths, filters, ignores } from './options';
import { CLIArguments, CLIWatchConfig } from './types';

export async function watch(cwd: string, argv: CLIArguments): Promise<void> {
  configPaths(commander);
  filters(commander);
  ignores(commander);

  commander.parse(argv as Array<string>);

  const { config, results, filter, ignore } = (commander as unknown) as CLIWatchConfig;

  const watcher = await betterer.watch({
    configPaths: config,
    cwd,
    filters: filter,
    ignores: ignore,
    resultsPath: results
  });

  return new Promise((): void => {
    process.on('SIGINT', () => {
      watcher.stop();
    });
  });
}
