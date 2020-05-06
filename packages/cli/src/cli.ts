import * as commander from 'commander';

import { CLIArguments } from './types';

const enum Commands {
  start = 'start',
  init = 'init',
  watch = 'watch'
}

const COMMANDS: Array<string> = [Commands.start, Commands.init, Commands.watch];

// HACK:
// It's easier to use require than to try to get `await import`
// to work right for the package.json...
/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json');

export function cli(argv: CLIArguments): void {
  commander.version(version);

  commander.command(Commands.start, 'run betterer');
  commander.command(Commands.init, 'init betterer');
  commander.command(Commands.watch, 'run betterer in watch mode');

  const args = argv.slice(0);
  const [, , command] = args;
  if (!COMMANDS.includes(command)) {
    args.splice(2, 0, Commands.start);
  }

  commander.parse(args);
}
