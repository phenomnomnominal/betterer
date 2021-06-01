import { BettererReporter } from '../reporters';

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnores = ReadonlyArray<string>;
export type BettererConfigReporter = string | BettererReporter;
export type BettererConfigReporters = ReadonlyArray<BettererConfigReporter>;

export type BettererConfig = {
  // Base:
  cache: boolean;
  cachePath: string;
  configPaths: BettererConfigPaths;
  cwd: string;
  filePaths: BettererConfigPaths;
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

export type BettererOptionsPaths = Array<string> | string;
export type BettererOptionsExcludes = Array<string | RegExp> | string;
export type BettererOptionsFilters = Array<string | RegExp> | string;
export type BettererOptionsIncludes = Array<string> | string;
export type BettererOptionsReporters = Array<string | BettererReporter>;

export type BettererOptionsBase = Partial<{
  cache: boolean;
  cachePath: string;
  configPaths: BettererOptionsPaths;
  cwd: string;
  filters: BettererOptionsFilters;
  reporters: BettererConfigReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
}>;

export type BettererOptionsStartBase = BettererOptionsBase &
  Partial<{
    excludes: BettererOptionsExcludes;
    includes: BettererOptionsIncludes;
  }>;

export type BettererOptionsStartCI = BettererOptionsStartBase &
  Partial<{
    ci: true;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartDefault = BettererOptionsStartBase &
  Partial<{
    ci: false;
    strict: false;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartStrict = BettererOptionsStartBase &
  Partial<{
    ci: false;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartUpdate = BettererOptionsStartBase &
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
