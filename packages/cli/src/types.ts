/**
 * @internal This could change at any point! Please don't use!
 *
 * An array of string arguments for a CLI command.
 */
export type BettererCLIArguments = Array<string>;

export interface BettererCLIEnvConfig {
  debug: boolean;
  debugLog: string;
}

export interface BettererCLIConfig extends BettererCLIEnvConfig {
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

export interface BettererCLIInitConfig extends BettererCLIEnvConfig {
  automerge: boolean;
  config: string;
  results: string;
}

export interface BettererCLIMergeConfig extends BettererCLIEnvConfig {
  results: string;
  contents: Array<string>;
}

export interface BettererCLIResultsConfig extends BettererCLIEnvConfig {
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  include: BettererCLIArguments;
  results: string;
}

export interface BettererCLIUpgradeConfig extends BettererCLIEnvConfig {
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
