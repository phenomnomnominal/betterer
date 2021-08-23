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
  workers: number;
};

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  config: string;
};

export type BettererCLIResultsConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  include: BettererCLIArguments;
  results: string;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
