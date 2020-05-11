import { CommanderStatic } from 'commander';
import { CLIArguments } from './types';

export function configPath(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', './.betterer.ts');
}

export function configPaths(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', argsToArray);
}

export function resultsPath(commander: CommanderStatic): void {
  commander.option('-r, --results [value]', 'Path to test results file relative to CWD');
}

export function filters(commander: CommanderStatic): void {
  commander.option('-f, --filter [value]', 'RegExp filter for tests to run', argsToArray);
}

export function ignores(commander: CommanderStatic): void {
  commander.option('-i, --ignore [value]', 'Glob pattern for files to ignore', argsToArray);
}

function argsToArray(value: string, previous: CLIArguments = []): CLIArguments {
  return previous.concat([value]);
}
