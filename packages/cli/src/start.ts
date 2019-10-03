import * as commander from 'commander';
import * as path from 'path';

import { betterer } from '@betterer/betterer';
import { DEFAULT_CONFIG_PATH, DEFAULT_RESULTS_PATH } from './constants';

export async function start(cwd: string): Promise<void> {
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
    .parse(process.argv);

  const { config } = commander;

  let configPaths = [DEFAULT_CONFIG_PATH];
  if (config && config.length) {
    configPaths = config;
  }
  configPaths = configPaths.map(configPath => path.resolve(cwd, configPath));
  const resultsPath = path.resolve(cwd, commander.results);
  const { worse } = await betterer({ configPaths, resultsPath });
  process.exit(worse.length !== 0 ? 1 : 0);
}
