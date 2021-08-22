import commander from 'commander';

import { BettererCLIArguments, BettererPackageJSON } from './types';

enum Command {
  ci = 'ci',
  init = 'init',
  precommit = 'precommit',
  results = 'results',
  start = 'start',
  watch = 'watch'
}

type CommandName = `${Command}`;

// HACK:
// It's easier to use require than to try to get `await import`
// to work right for the package.json...
/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json') as BettererPackageJSON;

/** @internal Definitely not stable! Please don't use! */
export function cliΔ(argv: BettererCLIArguments): void {
  commander.version(version);

  // CI:
  // Throw if test run creates a diff
  commander.command(Command.ci, 'run Betterer in CI mode');

  // Precommit:
  // Throw if test run is worse, `git add` if better
  commander.command(Command.precommit, 'run Betterer in precommit mode');

  // Results:
  commander.command(Command.results, 'get current results of Betterer tests');

  // Run:
  commander.command(Command.start, 'run Betterer');
  commander.command(Command.watch, 'run Betterer in watch mode');

  // Init:
  commander.command(Command.init, 'init Betterer in a project');

  const args = argv.slice(0);
  const [, , command] = args;
  if (!Command[command as CommandName]) {
    args.splice(2, 0, Command.start);
  }

  commander.parse(args);
}
