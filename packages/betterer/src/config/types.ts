import { BettererReporter } from '../reporters';

export type BettererConfigPaths = ReadonlyArray<string>;
export type BettererConfigExcludes = ReadonlyArray<RegExp>;
export type BettererConfigFilters = ReadonlyArray<RegExp>;
export type BettererConfigIgnores = ReadonlyArray<string>;
export type BettererConfigIncludes = ReadonlyArray<string>;

export type BettererConfig = BettererConfigBase & BettererConfigStart & BettererConfigWatch;

export type BettererWorkerRunConfig = Omit<BettererConfig, 'reporter'>;

export type BettererConfigBase = {
  cache: boolean;
  cachePath: string;
  configPaths: BettererConfigPaths;
  cwd: string;
  filters: BettererConfigFilters;
  reporter: BettererReporter;
  resultsPath: string;
  tsconfigPath: string | null;
  workers: number;
};

export type BettererConfigStart = {
  ci: boolean;
  excludes: BettererConfigExcludes;
  includes: BettererConfigIncludes;
  precommit: boolean;
  strict: boolean;
  update: boolean;
};

export type BettererConfigWatch = {
  ignores: BettererConfigIgnores;
  watch: boolean;
};

export type BettererOptionsPaths = Array<string> | string;
export type BettererOptionsExcludes = Array<string | RegExp> | string;
export type BettererOptionsFilters = Array<string | RegExp> | string;
export type BettererOptionsIgnores = Array<string>;
export type BettererOptionsIncludes = Array<string> | string;
export type BettererOptionsReporter = string | BettererReporter;
export type BettererOptionsReporters = Array<BettererOptionsReporter>;

export type BettererOptionsResults = Partial<{
  configPaths: BettererOptionsPaths;
  cwd: string;
  excludes: BettererOptionsExcludes;
  filters: BettererOptionsFilters;
  includes: BettererOptionsIncludes;
  resultsPath: string;
}>;

export type BettererOptionsBase = Partial<{
  cache: boolean;
  cachePath: string;
  configPaths: BettererOptionsPaths;
  cwd: string;
  filters: BettererOptionsFilters;
  reporters: BettererOptionsReporters;
  resultsPath: string;
  silent: boolean;
  tsconfigPath: string;
  workers: number | boolean;
}>;

export type BettererOptionsOverride = Partial<{
  filters: BettererOptionsFilters;
  ignores: BettererOptionsIgnores;
  reporters: BettererOptionsReporters;
}>;

export type BettererOptionsStartBase = BettererOptionsBase &
  Partial<{
    excludes: BettererOptionsExcludes;
    includes: BettererOptionsIncludes;
  }>;

export type BettererOptionsStartCI = BettererOptionsStartBase &
  Partial<{
    ci: true;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartDefault = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartPrecommit = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: true;
    strict: boolean;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartStrict = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
  }>;

export type BettererOptionsStartUpdate = BettererOptionsStartBase &
  Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: true;
    watch: false;
  }>;

export type BettererOptionsStart =
  | BettererOptionsStartCI
  | BettererOptionsStartDefault
  | BettererOptionsStartPrecommit
  | BettererOptionsStartStrict
  | BettererOptionsStartUpdate;

export type BettererOptionsRunner = BettererOptionsBase;

export type BettererOptionsWatch = BettererOptionsRunner &
  Partial<{
    ignores: BettererOptionsIgnores;
    watch: true;
  }>;
