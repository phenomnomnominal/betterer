import * as commander from 'commander';

const DEFAULT_COMMAND = 'start';

const COMMANDS = [DEFAULT_COMMAND, 'init'];

export function cli(argv: Array<string>): void {
  // HACK:
  // It's easier to use require than to try to get `await import`
  // to work right for the package.json...
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require('../package.json');

  commander.version(version);

  commander.command(DEFAULT_COMMAND, 'run betterer');
  commander.command('init', 'init betterer');

  const args = argv.slice(0);
  const [, , command] = args;
  if (!COMMANDS.includes(command)) {
    args.splice(2, 0, DEFAULT_COMMAND);
  }

  commander.parse(args);
}
