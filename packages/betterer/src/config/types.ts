export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnore = ReadonlyArray<string>;

export type BettererConfigPartial = Partial<{
  configPaths: BettererConfigPaths | string;
  resultsPath: string;
  filters: BettererConfigFilters | ReadonlyArray<string> | string;
  watch: boolean;
  ignores: BettererConfigIgnore | string;
  cwd: string;
}>;

export type BettererConfig = {
  configPaths: BettererConfigPaths;
  resultsPath: string;
  filters: BettererConfigFilters;
  ignores: BettererConfigIgnore;
  cwd: string;
};
