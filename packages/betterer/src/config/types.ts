import { BettererReporter } from '../reporters';

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnores = ReadonlyArray<string>;
export type BettererConfigReporter = string | BettererReporter;
export type BettererConfigReporters = ReadonlyArray<BettererConfigReporter>;

export type BettererConfig = {
  allowDiff: boolean;
  allowUpdate: boolean;
  configPaths: BettererConfigPaths;
  cwd: string;
  filters: BettererConfigFilters;
  ignores: BettererConfigIgnores;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string | null;
  update: boolean;
  watch: boolean;
};

export type BettererBaseConfigPartial = Partial<{
  configPaths: BettererConfigPaths | string;
  cwd: string;
  filters: ReadonlyArray<string | RegExp> | string;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
}>;

export type BettererStartConfigPartial = BettererBaseConfigPartial &
  Partial<{
    allowDiff: boolean;
    allowUpdate: boolean;
    update: boolean;
    watch: false;
  }>;

export type BettererWatchConfigPartial = BettererBaseConfigPartial &
  Partial<{
    ignores: BettererConfigIgnores;
    watch: true;
  }>;

export type BettererConfigPartial = BettererStartConfigPartial | BettererWatchConfigPartial;
