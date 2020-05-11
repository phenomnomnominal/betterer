export type CLIArguments = ReadonlyArray<string>;

export type CLIStartConfig = {
  config: CLIArguments;
  filter: CLIArguments;
  results: string;
};

export type CLIWatchConfig = CLIStartConfig & {
  ignore: CLIArguments;
};
