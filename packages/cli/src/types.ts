export type BettererCLIArguments = Array<string>;

export type BettererCLIEnvConfig = {
  debug: boolean;
  debugLog: string;
};

export type BettererCLIConfig = BettererCLIEnvConfig & {
  cache: boolean;
  cachePath: string;
  config: BettererCLIArguments;
  exclude: BettererCLIArguments;
  filter: BettererCLIArguments;
  ignore: BettererCLIArguments;
  include: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  strict: boolean;
  tsconfig: string;
  update: boolean;
};

export type BettererCLIInitConfig = BettererCLIEnvConfig & {
  config: string;
};

export type BettererPackageJSON = {
  version: string;
  scripts: Record<string, string> & { betterer: string };
  devDependencies: Record<string, string>;
};

/* 
  @deprecated doesn't make sense anymore. Will be removed in v5.0.0
*/
export type BettererCLIBaseConfig = BettererCLIEnvConfig & {
  config: BettererCLIArguments;
  filter: BettererCLIArguments;
  reporter: BettererCLIArguments;
  results: string;
  silent: boolean;
  tsconfig: string;
};

/* 
  @deprecated doesn't make sense anymore. Will be removed in v5.0.0
*/
export type BettererCLICacheConfig = {
  cache: boolean;
  cachePath: string;
};

/* 
  @deprecated doesn't make sense anymore. Will be removed in v5.0.0
*/
export type BettererCLICIConfig = BettererCLIBaseConfig & {
  exclude: BettererCLIArguments;
  include: BettererCLIArguments;
};

/* 
  @deprecated doesn't make sense anymore. Will be removed in v5.0.0
*/
export type BettererCLIStartConfig = BettererCLIBaseConfig &
  BettererCLICacheConfig & {
    exclude: BettererCLIArguments;
    include: BettererCLIArguments;
    strict: boolean;
    update: boolean;
  };

/* 
  @deprecated doesn't make sense anymore. Will be removed in v5.0.0
*/
export type BettererCLIWatchConfig = BettererCLIBaseConfig &
  BettererCLICacheConfig & {
    ignore: BettererCLIArguments;
  };
