import { betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { configPaths, filters } from './options';
import { CLIArguments, CLIWatchConfig } from './types';

export async function start(cwd: string, argv: CLIArguments): Promise<void> {
  configPaths(commander);
  filters(commander);
  commander.parse(argv as Array<string>);
  const { config, results, filter } = (commander as unknown) as CLIWatchConfig;
  const stop = await betterer({ configPaths: config, filters: filter, resultsPath: results, cwd }, true);
  return new Promise((): void => {
    process.on('SIGINT', () => stop());
  });
}
