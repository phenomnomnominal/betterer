import * as commander from 'commander';
import * as path from 'path';

import { BettererStats, betterer, bettererWatch } from '@betterer/betterer';
import { warn } from '@betterer/logger';
import {
  DEFAULT_CONFIG_PATH,
  DEFAULT_FILTER,
  DEFAULT_RESULTS_PATH,
  DEFAULT_WATCH
} from './constants';

type CLIStartConfig = {
  config: ReadonlyArray<string>;
  filter: ReadonlyArray<string>;
  ignore: ReadonlyArray<string>;
  results: string;
  watch: boolean;
};

export async function start(
  cwd: string,
  argv: Array<string>
): Promise<BettererStats> {
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      (value: string, previous: ReadonlyArray<string>): ReadonlyArray<string> =>
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
      (value: string, previous: ReadonlyArray<string>): ReadonlyArray<string> =>
        previous.concat([value]),
      []
    )
    .option(
      '-w, --watch [value]',
      'Run ☀️ betterer in watch mode',
      DEFAULT_WATCH
    )
    .option(
      '-i, --ignore [value]',
      'RegExp filter for files at watch',
      (value: string, previous: ReadonlyArray<string>): ReadonlyArray<string> =>
        previous.concat([value]),
      []
    )
    .parse(argv);

  const cliConfig = (commander as unknown) as CLIStartConfig;

  let { config, filter, ignore } = cliConfig;
  const { watch } = cliConfig;

  config = config && config.length ? config : [DEFAULT_CONFIG_PATH];
  const configPaths = config.map(configPath => path.resolve(cwd, configPath));

  const resultsPath = path.resolve(cwd, commander.results);

  filter = filter && filter.length ? filter : [DEFAULT_FILTER];
  const filters = filter.map((filter: string) => new RegExp(filter, 'i'));

  ignore = ignore && ignore.length ? ignore : [];
  const ignores = ignore.map((ignore: string) => new RegExp(ignore, 'i'));
  if (ignores.length && !watch) {
    warn();
  }

  if (watch) {
    const stop = await bettererWatch({
      configPaths,
      filters,
      ignores,
      resultsPath
    });
    return new Promise((resolve): void => {
      process.on('SIGINT', () => {
        const stats = stop();
        resolve(stats);
      });
    });
  }
  return await betterer({ configPaths, filters, resultsPath });
}
