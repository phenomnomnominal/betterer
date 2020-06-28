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

export type CLIScoreConfig = {
  results: string;
  silent: boolean;
};
