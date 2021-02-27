import { BettererReporter } from '../reporters';

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnores = ReadonlyArray<string>;
export type BettererConfigReporter = string | BettererReporter;
export type BettererConfigReporters = ReadonlyArray<BettererConfigReporter>;

export type BettererConfig = {
  // Base:
  configPaths: BettererConfigPaths;
  cwd: string;
  filters: BettererConfigFilters;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string | null;
  // Start:
  ci: boolean;
  strict: boolean;
  update: boolean;
  // Runner;
  ignores: BettererConfigIgnores;
  // Watch:
  watch: boolean;
};

export type BettererOptionsBase = Partial<{
  configPaths: BettererConfigPaths | string;
  cwd: string;
  filters: ReadonlyArray<string | RegExp> | string;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
}>;

export type BettererOptionsStartCI = BettererOptionsBase &
  Partial<{
    ci: true;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartDefault = BettererOptionsBase &
  Partial<{
    ci: false;
    strict: false;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartStrict = BettererOptionsBase &
  Partial<{
    ci: false;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartUpdate = BettererOptionsBase &
  Partial<{
    ci: false;
    strict: false;
    update: true;
    watch: false;
  }>;

export type BettererOptionsStart =
  | BettererOptionsStartCI
  | BettererOptionsStartDefault
  | BettererOptionsStartStrict
  | BettererOptionsStartUpdate;

export type BettererOptionsRunner = BettererOptionsBase &
  Partial<{
    ignores: BettererConfigIgnores;
  }>;

export type BettererOptionsWatch = BettererOptionsRunner &
  Partial<{
    watch: true;
  }>;
