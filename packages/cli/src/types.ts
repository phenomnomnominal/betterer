export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLICIConfig = BettererCLIEnvConfig &
  BettererCLIBaseConfig & {
    allowUpdate: false;
    update: false;
  };

export type BettererCLIBaseConfig = {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

export type BettererCLIStartConfig = BettererCLIEnvConfig &
  BettererCLIBaseConfig & {
    allowUpdate: boolean;
    update: boolean;
  };

export type BettererCLIWatchConfig = BettererCLIEnvConfig &
  BettererCLIBaseConfig & {
    ignore: BettererCLIArguments;
  };

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  config: string;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
