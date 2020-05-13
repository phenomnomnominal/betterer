import { BettererStats, betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { configPathsOption, filtersOption, resultsPathOption, updateOption } from './options';
import { CLIArguments, CLIStartConfig } from './types';

export async function start(cwd: string, argv: CLIArguments): Promise<BettererStats> {
  configPathsOption(commander);
  resultsPathOption(commander);
  filtersOption(commander);
  updateOption(commander);

  commander.parse(argv as Array<string>);

  const { config, results, filter, update } = (commander as unknown) as CLIStartConfig;
  return betterer({ configPaths: config, filters: filter, resultsPath: results, cwd, update });
}
