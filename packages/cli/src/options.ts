import { CommanderStatic } from 'commander';
import { CLIArguments } from './types';

export function configPathOption(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', './.betterer.ts');
}

export function configPathsOption(commander: CommanderStatic): void {
  commander.option('-c, --config [value]', 'Path to test definition file relative to CWD', argsToArray);
}

export function resultsPathOption(commander: CommanderStatic): void {
  commander.option('-r, --results [value]', 'Path to test results file relative to CWD');
}

export function filtersOption(commander: CommanderStatic): void {
  commander.option('-f, --filter [value]', 'RegExp filter for tests to run', argsToArray);
}

export function ignoresOption(commander: CommanderStatic): void {
  commander.option('-i, --ignore [value]', 'Glob pattern for files to ignore', argsToArray);
}

export function updateOption(commander: CommanderStatic): void {
  commander.option('-u, --update', 'Force update the results file, even if things get worse');
}

function argsToArray(value: string, previous: CLIArguments = []): CLIArguments {
  return previous.concat([value]);
}
