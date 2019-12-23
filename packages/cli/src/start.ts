import * as commander from 'commander';
import * as path from 'path';

import { BettererStats, betterer } from '@betterer/betterer';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH,
  DEFAULT_FILTER
} from './constants';

type CLIStartConfig = {
  config: Array<string>;
  results: string;
  filter: Array<string>;
};

export async function start(
  cwd: string,
  argv: Array<string>
): Promise<BettererStats> {
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      (value: string, previous: Array<string>): Array<string> =>
        previous.concat([value]),
      []
    )
    .option(
      '-r, --results [value]',
      'Path to test results file relative to CWD',
      DEFAULT_RESULTS_PATH
    )
    .option(
      '-f, --filter [value]',
      'RegExp filter for tests to run',
      (value: string, previous: Array<string>): Array<string> =>
        previous.concat([value]),
      []
    )
    .parse(argv);

  let { config, filter } = (commander as unknown) as CLIStartConfig;

  config = config && config.length ? config : [DEFAULT_CONFIG_PATH];
  const configPaths = config.map(configPath => path.resolve(cwd, configPath));

  const resultsPath = path.resolve(cwd, commander.results);

  filter = filter && filter.length ? filter : [DEFAULT_FILTER];
  const filters = filter.map((filter: string) => new RegExp(filter, 'i'));

  return await betterer({ configPaths, filters, resultsPath });
}
