import commander from 'commander';

import { BettererCLIArguments, BettererPackageJSON } from './types';

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
const { version } = require('../package.json') as BettererPackageJSON;

export function cliΔ(argv: BettererCLIArguments): void {
  commander.version(version);

  commander.command(Commands.init, 'init Betterer in a project');
  commander.command(Commands.start, 'run Betterer');
  commander.command(Commands.watch, 'run Betterer in watch mode');

  const args = argv.slice(0);
  const [, , command] = args;
  if (!COMMANDS.includes(command)) {
    args.splice(2, 0, Commands.start);
  }

  commander.parse(args);
}
