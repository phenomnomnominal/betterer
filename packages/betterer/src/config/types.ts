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

export type BettererBaseConfigPartial = Partial<{
  configPaths: BettererConfigPaths | string;
  cwd: string;
  filters: ReadonlyArray<string | RegExp> | string;
  reporters: BettererReporterNames;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
}>;

export type BettererStartConfigPartial = BettererBaseConfigPartial &
  Partial<{
    allowDiff: boolean;
    update: boolean;
  }>;

export type BettererWatchConfigPartial = BettererBaseConfigPartial &
  Partial<{
    ignores: BettererConfigIgnore;
  }>;

export type BettererConfigPartial = BettererBaseConfigPartial & BettererStartConfigPartial & BettererWatchConfigPartial;
