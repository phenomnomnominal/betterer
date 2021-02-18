import commander from 'commander';
import {
  BettererCLIArguments,
  BettererCLICIConfig,
  BettererCLIEnvConfig,
  BettererCLIInitConfig,
  BettererCLIStartConfig,
  BettererCLIWatchConfig
} from './types';

export function ciOptions(argv: BettererCLIArguments): BettererCLICIConfig {
  configPathsOption();
  resultsPathOption();
  tsconfigPathOption();
  filtersOption();
  silentOption();
  reportersOption();
  return setEnv<BettererCLICIConfig>(argv);
}

export function initOptions(argv: BettererCLIArguments): BettererCLIInitConfig {
  configPathOption();
  return setEnv<BettererCLIInitConfig>(argv);
}

export function startOptions(argv: BettererCLIArguments): BettererCLIStartConfig {
  configPathsOption();
  resultsPathOption();
  tsconfigPathOption();
  filtersOption();
  silentOption();
  allowUpdateOption();
  updateOption();
  reportersOption();
  return setEnv<BettererCLIStartConfig>(argv);
}

export function watchOptions(argv: BettererCLIArguments): BettererCLIWatchConfig {
  configPathsOption();
  resultsPathOption();
  tsconfigPathOption();
  filtersOption();
  silentOption();
  reportersOption();
  ignoresOption();
  return setEnv<BettererCLIWatchConfig>(argv);
}

function setEnv<T extends BettererCLIEnvConfig>(argv: BettererCLIArguments): T {
  commander.option('-d, --debug', 'Enable verbose debug logging', false);
  commander.option('-l, --debug-log [value]', 'File path to save verbose debug logging to disk', './betterer.log');

  const parsed = (commander.parse(argv) as unknown) as T;
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

function configPathOption(): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', './.betterer.ts');
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

function handleBool(val: string) {
  return val !== 'false';
}

function silentOption(): void {
  commander.option('-s, --silent [true|false]', 'Disable all default reporters. Custom reporters still work normally.');
}

function allowUpdateOption(): void {
  commander.option('--allow-update [true|false]', 'Whether to allow the `--update` option or not.', handleBool);
}

function updateOption(): void {
  commander.option('-u, --update [true|false]', 'Force update the results file, even if things get worse', handleBool);
}

function argsToArray(value: string, previous: BettererCLIArguments = []): BettererCLIArguments {
  return previous.concat([value]);
}
