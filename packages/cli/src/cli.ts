import * as commander from 'commander';

import {
  CONFIG_ENV,
  RESULTS_ENV,
  DEFAULT_CONFIG_PATH,
  DEFAULT_RESULTS_PATH
} from './env';

export function cli(): void {
  // HACK:
  // It's easier to use require than to try to get `await import`
  // to work right for the package.json...
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require('../package.json');

  commander.version(version);

  process.env[CONFIG_ENV] = DEFAULT_CONFIG_PATH;
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      DEFAULT_CONFIG_PATH
    )
    .on('option:config', value => (process.env[CONFIG_ENV] = value));

  process.env[RESULTS_ENV] = DEFAULT_RESULTS_PATH;
  commander
    .option(
      '-r, --results [value]',
      'Path to test results file relative to CWD',
      DEFAULT_RESULTS_PATH
    )
    .on('option:results', value => (process.env[RESULTS_ENV] = value));

  commander.command('start', 'run betterer', { isDefault: true });
  commander.command('init', 'init betterer');

  commander.parse(process.argv);
}
