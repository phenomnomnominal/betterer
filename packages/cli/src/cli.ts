import commander from 'commander';

import { BettererCLIArguments, BettererPackageJSON } from './types';

enum Command {
  ci = 'ci',
  start = 'start',
  init = 'init',
  watch = 'watch'
}

type CommandName = `${Command}`;

// HACK:
// It's easier to use require than to try to get `await import`
// to work right for the package.json...
/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json') as BettererPackageJSON;

export function cliΔ(argv: BettererCLIArguments): void {
  commander.version(version);

  commander.command(Command.ci, 'run Betterer in CI mode');
  commander.command(Command.init, 'init Betterer in a project');
  commander.command(Command.start, 'run Betterer');
  commander.command(Command.watch, 'run Betterer in watch mode');

  const args = argv.slice(0);
  const [, , command] = args;
  if (!Command[command as CommandName]) {
    args.splice(2, 0, Command.start);
  }

  commander.parse(args);
}
