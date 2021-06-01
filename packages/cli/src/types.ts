export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLIBaseConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

export type BettererCLICacheConfig = {
  cache: boolean;
  cachePath: string;
};

export type BettererCLICIConfig = BettererCLIBaseConfig & {
  exclude: BettererCLIArguments;
  include: BettererCLIArguments;
};

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  config: string;
};

export type BettererCLIStartConfig = BettererCLIBaseConfig &
  BettererCLICacheConfig & {
    exclude: BettererCLIArguments;
    include: BettererCLIArguments;
    strict: boolean;
    update: boolean;
  };

export type BettererCLIWatchConfig = BettererCLIBaseConfig &
  BettererCLICacheConfig & {
    ignore: BettererCLIArguments;
  };

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
