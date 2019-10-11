import { ConstraintResult } from '@betterer/constraints';

type BettererTest<T = unknown> = () => T | Promise<T>;
type BettererConstraint<T = unknown> = (
  current: T,
  previous: T
) => ConstraintResult | Promise<ConstraintResult>;

export type Betterer<T = number> = {
  test: BettererTest<T>;
  constraint: BettererConstraint<T>;
  goal: T;
};

export type BettererTests = {
  [key: string]: Betterer;
};

export type BettererConfig = {
  configPaths: Array<string>;
  resultsPath?: string;
  filters?: Array<RegExp>;
};

type BettererResult = {
  timestamp: number;
  value: string;
};

export type BettererResults = Record<string, BettererResult>;

export type BettererStats = {
  obsolete: Array<string>;
  ran: Array<string>;
  failed: Array<string>;
  new: Array<string>;
  better: Array<string>;
  same: Array<string>;
  worse: Array<string>;
  messages: Array<string>;
  completed: Array<string>;
};
