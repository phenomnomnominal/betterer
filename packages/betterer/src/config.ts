export type BettererConfig = {
  configPaths: ReadonlyArray<string>;
  resultsPath: string;
  filters?: ReadonlyArray<RegExp>;
  watch?: boolean;
  ignores?: ReadonlyArray<RegExp>;
};
