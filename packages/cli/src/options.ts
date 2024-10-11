import type { BettererCLIArguments } from './types.js';

import { Command } from 'commander';

import { BettererCommand } from './types.js';

let command: Command;

export function cliCommand(name: BettererCommand): Command {
  command = new Command(name);
  cacheOption();
  configPathsOption();
  excludesOption();
  filtersOption();
  ignoresOption();
  logoOption();
  reportersOption();
  resultsPathOption();
  silentOption();
  strictOption();
  updateOption();
  workersOption();
  return command;
}

export function initCommand(): Command {
  command = new Command(BettererCommand.init);
  automergeOption();
  configPathOption();
  logoOption();
  resultsPathOption();
  return command;
}

export function mergeCommand(): Command {
  command = new Command(BettererCommand.merge);
  resultsPathOption();
  return command;
}

export function resultsCommand(): Command {
  command = new Command(BettererCommand.results);
  configPathsOption();
  excludesOption();
  filtersOption();
  logoOption();
  resultsPathOption();
  return command;
}

export function upgradeCommand(): Command {
  command = new Command(BettererCommand.upgrade);
  configPathsOption();
  logoOption();
  saveOption();
  return command;
}

function cacheOption(): void {
  command.option('--cache', 'When present, Betterer will only run on changed files.');
  command.option('--cachePath [value]', 'Path to Betterer cache file relative to CWD');
}

function configPathOption(): void {
  command.option('-c, --config [value]', 'Path to test definition file relative to CWD');
}

function configPathsOption(): void {
  command.option(
    '-c, --config [value]',
    'Path to test definition file relative to CWD. Takes multiple values',
    argsToArray
  );
}

function automergeOption(): void {
  command.option('--automerge', 'Enable automatic merging for the Betterer results file');
}

function resultsPathOption(): void {
  command.option('-r, --results [value]', 'Path to test results file relative to CWD');
}

function filtersOption(): void {
  command.option(
    '-f, --filter [value]',
    'RegExp filter for tests to run. Add "!" at the start to negate. Takes multiple values',
    argsToArray
  );
}

function excludesOption(): void {
  command.option('--exclude [value]', 'RegExp filter for files to exclude. Takes multiple values', argsToArray);
}

function ignoresOption(): void {
  command.option('-i, --ignore [value]', 'Glob pattern for files to ignore. Takes multiple values', argsToArray);
}

function logoOption(): void {
  command.option(
    '--logo',
    'When set to `false` the default reporter will not emit a logo. Defaults to `true`',
    argsToPrimitive
  );
}

function reportersOption(): void {
  command.option(
    '-R, --reporter [value]',
    'npm package name for a Betterer reporter. Takes multiple values',
    argsToArray
  );
}

function saveOption(): void {
  command.option('--save', 'When present, Betterer will save the result of an upgrade to disk.');
}

function silentOption(): void {
  command.option(
    '-s, --silent',
    'When present, all default reporters will be disabled. Custom reporters will still work normally.'
  );
}

function strictOption(): void {
  command.option(
    '--strict',
    'When present, the "how to update" message will not be shown and the `--update` option will be set to false.'
  );
}

function updateOption(): void {
  command.option('-u, --update', 'When present, the results file will be updated, even if things get worse.');
}

function workersOption(): void {
  command.option(
    '--workers [value]',
    'number of workers to use. Set to `false` to run tests serially. Defaults to number of CPUs - 2.',
    argsToPrimitive
  );
}

function argsToArray(value: string, previous: BettererCLIArguments = []): BettererCLIArguments {
  return previous.concat([value]);
}

function argsToPrimitive(value: string): string | number | boolean {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  const num = parseInt(value);
  if (num.toString() === value) {
    return num;
  }
  return value;
}
