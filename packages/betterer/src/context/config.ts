export type BettererConfig = {
  configPaths: Array<string>;
  resultsPath: string;
  filters?: Array<RegExp>;
  watch?: boolean;
  ignore?: Array<RegExp>;
};
