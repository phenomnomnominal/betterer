export type BettererConfig = {
  configPaths: BettererConfigPaths;
  resultsPath: string;
  filters?: BettererConfigFilters;
  watch?: boolean;
  ignores?: BettererConfigIgnore;
};

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnore = ReadonlyArray<RegExp>;
