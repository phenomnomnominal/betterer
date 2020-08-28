export type BettererCLIArguments = ReadonlyArray<string>;

export type BettererCLICIConfig = {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

export type BettererCLIStartConfig = {
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

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
