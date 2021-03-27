export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLIBaseConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  include: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

export type BettererCLICIConfig = BettererCLIBaseConfig;

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  config: string;
};

export type BettererCLIStartConfig = BettererCLIBaseConfig & { strict: boolean; update: boolean };

export type BettererCLIWatchConfig = BettererCLIBaseConfig & {
  ignore: BettererCLIArguments;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
