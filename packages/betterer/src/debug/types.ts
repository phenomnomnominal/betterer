import { Module } from 'module';

export type ModulePrivate = typeof Module & {
  _resolveFilename(id: string, module: NodeModule): string;
};

export type Func = (...args: Array<unknown>) => unknown;
export type Constructor = new (...args: Array<unknown>) => unknown;
export type FuncMap = Record<string, Func | Constructor>;

export type BettererDebugIncludes = Array<RegExp>;
export type BettererDebugIgnores = Array<RegExp>;
export type BettererDebugLogger = (logString: string) => void;

export type BettererDebugOptions = {
  enabled: boolean;
  time: boolean;
  values: boolean;
  logPath: string;
  header: string;
  include: BettererDebugIncludes;
  ignore: BettererDebugIgnores;
  logger: BettererDebugLogger;
};
