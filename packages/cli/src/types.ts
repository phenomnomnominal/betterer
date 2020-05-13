export type CLIArguments = ReadonlyArray<string>;

export type CLIStartConfig = {
  config: CLIArguments;
  filter: CLIArguments;
  results: string;
  update: boolean;
};

export type CLIWatchConfig = CLIStartConfig & {
  ignore: CLIArguments;
};
