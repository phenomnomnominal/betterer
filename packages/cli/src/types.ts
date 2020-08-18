export type CLIArguments = ReadonlyArray<string>;

export type CLIStartConfig = {
  config: CLIArguments;
  filter: CLIArguments;
  reporter: CLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
  update: boolean;
};

export type CLIWatchConfig = CLIStartConfig & {
  ignore: CLIArguments;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};
