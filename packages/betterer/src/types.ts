import { ConstraintResult } from '@betterer/constraints';

export type MaybeAsync<T> = T | Promise<T>;

export type BettererTest<T> = () => MaybeAsync<T>;

export type BettererConstraint<T> = (
  current: T,
  previous: T
) => MaybeAsync<ConstraintResult>;

export type BettererGoalFunction<SerialisedType> = (
  current: SerialisedType
) => MaybeAsync<boolean>;

export type BettererGoal<SerialisedType> =
  | SerialisedType
  | BettererGoalFunction<SerialisedType>;

export type BettererDiff<TestType, SerialisedType> = (
  current: TestType,
  serialisedCurrent: SerialisedType,
  serialisedPrevious: SerialisedType | null
) => MaybeAsync<void>;

export type Betterer<TestType, SerialisedType = TestType> = {
  test: BettererTest<TestType>;
  constraint: BettererConstraint<SerialisedType>;
  goal: BettererGoal<SerialisedType>;
  diff?: BettererDiff<TestType, SerialisedType>;
};

export type BettererTests = {
  [key: string]: Betterer<unknown, unknown>;
};

export type BettererConfig = {
  configPaths: Array<string>;
  resultsPath: string;
  filters?: Array<RegExp>;
};

export type BettererResult = {
  timestamp: number;
  value: unknown;
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
