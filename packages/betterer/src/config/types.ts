import { BettererReporterNames } from '../reporters';

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnore = ReadonlyArray<string>;

export type BettererConfig = {
  allowDiff: boolean;
  configPaths: BettererConfigPaths;
  cwd: string;
  filters: BettererConfigFilters;
  ignores: BettererConfigIgnore;
  reporters: BettererReporterNames;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string | null;
  update: boolean;
};

export type BettererConfigPartial = Partial<{
  allowDiff: boolean;
  configPaths: BettererConfigPaths | string;
  cwd: string;
  filters: BettererConfigFilters | ReadonlyArray<string> | string;
  ignores: BettererConfigIgnore | string;
  reporters: BettererReporterNames;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
  update: boolean;
}>;
