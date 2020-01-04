import { BettererStats, betterer, bettererWatch } from '@betterer/betterer';
import * as commander from 'commander';
import * as path from 'path';

import { CLIArguments, CLIStartConfig } from './types';

const DEFAULT_CONFIG_PATH = './.betterer';
const DEFAULT_RESULTS_PATH = `./.betterer.results`;
const DEFAULT_FILTER = '.*';
const DEFAULT_WATCH = false;

export async function start(
  cwd: string,
  argv: CLIArguments
): Promise<BettererStats> {
  return startBetterer(cwd, getStartConfig(argv));
}

function getStartConfig(argv: CLIArguments): CLIStartConfig {
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      (value: string, previous: CLIArguments): CLIArguments =>
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
      (value: string, previous: CLIArguments): CLIArguments =>
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
      (value: string, previous: CLIArguments): CLIArguments =>
        previous.concat([value]),
      []
    )
    .parse(argv as Array<string>);

  return (commander as unknown) as CLIStartConfig;
}

async function startBetterer(
  cwd: string,
  startConfig: CLIStartConfig
): Promise<BettererStats> {
  let { config, filter, ignore } = startConfig;
  const { watch } = startConfig;

  config = config && config.length ? config : [DEFAULT_CONFIG_PATH];
  const configPaths = config.map(configPath => path.resolve(cwd, configPath));

  const resultsPath = path.resolve(cwd, commander.results);

  filter = filter && filter.length ? filter : [DEFAULT_FILTER];
  const filters = filter.map((filter: string) => new RegExp(filter, 'i'));

  ignore = ignore && ignore.length ? ignore : [];
  const ignores = ignore.map((ignore: string) => new RegExp(ignore, 'i'));

  const options = { configPaths, filters, ignores, resultsPath };

  if (watch) {
    const stop = await bettererWatch(options);
    return new Promise((): void => {
      process.on('SIGINT', () => {
        stop();
      });
    });
  }
  return await betterer(options);
}
