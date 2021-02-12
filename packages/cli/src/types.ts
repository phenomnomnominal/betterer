export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLICIConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

export type BettererCLIStartConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
  update: boolean;
};

export type BettererCLIWatchConfig = BettererCLIStartConfig & {
  ignore: BettererCLIArguments;
};

export type BettererCLIInitConfig = {
  config: string;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
