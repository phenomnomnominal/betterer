import { CommanderStatic } from 'commander';
import { CLIArguments } from './types';

export function initOptions(commander: CommanderStatic): void {
  configPathOption(commander);
}

export function startOptions(commander: CommanderStatic): void {
  configPathsOption(commander);
  resultsPathOption(commander);
  tsconfigPathOption(commander);
  filtersOption(commander);
  ignoresOption(commander);
  updateOption(commander);
}

export function watchOptions(commander: CommanderStatic): void {
  startOptions(commander);
  updateOption(commander);
}

function configPathOption(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', './.betterer.ts');
}

function configPathsOption(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', argsToArray);
}

function resultsPathOption(commander: CommanderStatic): void {
  commander.option('-r, --results [value]', 'Path to test results file relative to CWD');
}

function tsconfigPathOption(commander: CommanderStatic): void {
  commander.option('-t, --tsconfig [value]', 'Path to TypeScript config file relative to CWD');
}

function filtersOption(commander: CommanderStatic): void {
  commander.option('-f, --filter [value]', 'RegExp filter for tests to run', argsToArray);
}

function ignoresOption(commander: CommanderStatic): void {
  commander.option('-i, --ignore [value]', 'Glob pattern for files to ignore', argsToArray);
}

function updateOption(commander: CommanderStatic): void {
  commander.option('-u, --update', 'Force update the results file, even if things get worse');
}

function argsToArray(value: string, previous: CLIArguments = []): CLIArguments {
  return previous.concat([value]);
}
