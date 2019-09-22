import * as commander from 'commander';

const DEFAULT_DEFINITION_PATH = './.betterer.js';
const DEFAULT_RESULTS_PATH = './.betterer.results';

import { CONFIG_ENV, RESULTS_ENV } from './env';

export function cli(): void {
  // HACK:
  // It's easier to use require than to try to get `await import`
  // to work right for the package.json...
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require('../package.json');

  commander.version(version);

  process.env[CONFIG_ENV] = DEFAULT_DEFINITION_PATH;
  commander
    .option(
      '-c, --config [value]',
      'Path to test definition file relative to CWD',
      DEFAULT_DEFINITION_PATH
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

  commander.parse(process.argv);
}
