export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLIConfig = BettererCLIEnvConfig & {
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
};

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  automerge: boolean;
  config: string;
  results: string;
};

export type BettererCLIMergeConfig = BettererCLIEnvConfig & {
  results: string;
  contents: Array<string>;
};

export type BettererCLIResultsConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  include: BettererCLIArguments;
  results: string;
};

export type BettererCLIUpgradeConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  save: boolean;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
