/**
 * @internal This could change at any point! Please don't use!
 *
 * An array of string arguments for a CLI command.
 */
export type BettererCLIArguments = Array<string>;

export enum BettererCommand {
  ci = 'ci',
  init = 'init',
  merge = 'merge',
  precommit = 'precommit',
  results = 'results',
  start = 'start',
  upgrade = 'upgrade',
  watch = 'watch'
}

export type BettererCommandName = `${BettererCommand}`;

export interface BettererCLIConfig {
  cache: boolean;
  cachePath: string;
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  ignore: BettererCLIArguments;
  include: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  strict: boolean;
  tsconfig: string;
  update: boolean;
  workers: number | boolean;
}

export interface BettererCLIInitConfig {
  automerge: boolean;
  config: string;
  results: string;
}

export interface BettererCLIMergeConfig {
  results: string;
  contents: Array<string>;
}

export interface BettererCLIResultsConfig {
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  include: BettererCLIArguments;
  results: string;
}

export interface BettererCLIUpgradeConfig {
  config: BettererCLIArguments;
  save: boolean;
}

/**
 * @internal This could change at any point! Please don't use!
 *
 * A basic representation of the package.json configuration file.
 */
export interface BettererPackageJSON {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
}
