import commander, { CommanderStatic } from 'commander';
import { BettererCLIArguments, BettererCLIConfig, BettererCLIEnvConfig, BettererCLIInitConfig } from './types';

export function cliOptions(argv: BettererCLIArguments): BettererCLIConfig {
  cacheOption();
  configPathsOption();
  excludesOption();
  filtersOption();
  ignoresOption();
  reportersOption();
  resultsPathOption();
  silentOption();
  strictOption();
  tsconfigPathOption();
  updateOption();
  const options = setEnv<BettererCLIConfig>(argv);
  options.include = options.args;
  return options;
}

export function initOptions(argv: BettererCLIArguments): BettererCLIInitConfig {
  configPathOption();
  return setEnv<BettererCLIInitConfig>(argv);
}

function setEnv<T extends BettererCLIEnvConfig>(argv: BettererCLIArguments): T & CommanderStatic {
  commander.option('-d, --debug', 'Enable verbose debug logging', false);
  commander.option('-l, --debug-log [value]', 'File path to save verbose debug logging to disk', './betterer.log');

  const parsed = commander.parse(argv) as unknown as T & CommanderStatic;
  if (parsed.debug) {
    process.env.BETTERER_DEBUG = '1';
    process.env.BETTERER_DEBUG_TIME = '1';
    process.env.BETTERER_DEBUG_VALUES = '1';
    if (parsed.debugLog) {
      process.env.BETTERER_DEBUG_LOG = parsed.debugLog;
    }
  }
  return parsed;
}

function cacheOption(): void {
  commander.option('--cache', 'When present, Betterer will only run on changed files.');
  commander.option('--cachePath [value]', 'Path to Betterer cache file relative to CWD');
}

function configPathOption(): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD');
}

function configPathsOption(): void {
  commander.option(
    '-c, --config [value]',
    'Path to test definition file relative to CWD. Takes multiple values',
    argsToArray
  );
}

function resultsPathOption(): void {
  commander.option('-r, --results [value]', 'Path to test results file relative to CWD');
}

function tsconfigPathOption(): void {
  commander.option('-t, --tsconfig [value]', 'Path to TypeScript config file relative to CWD');
}

function filtersOption(): void {
  commander.option('-f, --filter [value]', 'RegExp filter for tests to run. Takes multiple values', argsToArray);
}

function excludesOption(): void {
  commander.option('--exclude [value]', 'RegExp filter for files to exclude. Takes multiple values', argsToArray);
}

function ignoresOption(): void {
  commander.option('-i, --ignore [value]', 'Glob pattern for files to ignore. Takes multiple values', argsToArray);
}

function reportersOption(): void {
  commander.option(
    '-R, --reporter [value]',
    'npm package name for a Betterer reporter. Takes multiple values',
    argsToArray
  );
}

function silentOption(): void {
  commander.option(
    '-s, --silent',
    'When present, all default reporters will be disabled. Custom reporters will still work normally.'
  );
}

function strictOption(): void {
  commander.option(
    '--strict',
    'When present, the "how to update" message will not be shown and the `--update` option will be set to false.'
  );
}

function updateOption(): void {
  commander.option('-u, --update', 'When present, the results file will be updated, even if things get worse.');
}

function argsToArray(value: string, previous: BettererCLIArguments = []): BettererCLIArguments {
  return previous.concat([value]);
}
