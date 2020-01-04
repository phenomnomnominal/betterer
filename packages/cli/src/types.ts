export type CLIArguments = ReadonlyArray<string>;

export type CLIStartConfig = {
  config: CLIArguments;
  filter: CLIArguments;
  ignore: CLIArguments;
  results: string;
  watch: boolean;
};
