import { program, ExecutableCommandOptions } from 'commander';
import path from 'path';

import { BettererCLIArguments, BettererPackageJSON } from './types';

enum Command {
  ci = 'ci',
  init = 'init',
  merge = 'merge',
  precommit = 'precommit',
  results = 'results',
  start = 'start',
  upgrade = 'upgrade',
  watch = 'watch'
}

type CommandName = `${Command}`;

// HACK:
// It's easier to use require than to try to get `await import`
// to work right for the package.json...
/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json') as BettererPackageJSON;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** command-lie interface.
 */
export function cli__(argv: BettererCLIArguments): void {
  program.version(version);

  // CI:
  // Throw if test run creates a diff
  program.command(Command.ci, 'run Betterer in CI mode', getExecutable(Command.ci));

  // Merge:
  program.command(Command.merge, 'merge the Betterer results file', getExecutable(Command.merge));

  // Precommit:
  // Throw if test run is worse, `git add` if better
  program.command(Command.precommit, 'run Betterer in precommit mode', getExecutable(Command.precommit));

  // Results:
  program.command(Command.results, 'get current results of Betterer tests', getExecutable(Command.results));

  // Run:
  program.command(Command.start, 'run Betterer', getExecutable(Command.start));
  program.command(Command.watch, 'run Betterer in watch mode', getExecutable(Command.watch));

  // Init:
  program.command(Command.init, 'init Betterer in a project', getExecutable(Command.init));

  // Upgrade:
  program.command(Command.upgrade, 'upgrade Betterer files in a project', getExecutable(Command.upgrade));

  const args = argv.slice(0);
  const [, , command] = args;
  if (!Command[command as CommandName]) {
    args.splice(2, 0, Command.start);
  }

  program.parse(args);
}

function getExecutable(name: CommandName): ExecutableCommandOptions {
  return {
    executableFile: path.resolve(__dirname, `../bin/betterer-${name}`)
  };
}
