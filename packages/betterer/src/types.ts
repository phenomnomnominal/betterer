import { ConstraintResult } from '@betterer/constraints';

type BettererTest<T> = () => T | Promise<T>;
type BettererConstraint<T> = (
  current: T,
  previous: T
) => ConstraintResult | Promise<ConstraintResult>;

export type Betterer<TestType = unknown, SerialisedType = TestType> = {
  test: BettererTest<TestType>;
  constraint: BettererConstraint<SerialisedType>;
  goal: TestType;
};

export type BettererTests = {
  [key: string]: Betterer;
};

export type BettererConfig = {
  configPaths: Array<string>;
  resultsPath: string;
  filters?: Array<RegExp>;
};

export type BettererResult = {
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
