import { BettererStats, betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { configPaths, filters, resultsPath } from './options';
import { CLIArguments, CLIStartConfig } from './types';

export async function start(cwd: string, argv: CLIArguments): Promise<BettererStats> {
  configPaths(commander);
  resultsPath(commander);
  filters(commander);
  commander.parse(argv as Array<string>);

  const { config, results, filter } = (commander as unknown) as CLIStartConfig;
  return betterer({ configPaths: config, filters: filter, resultsPath: results, cwd });
}
