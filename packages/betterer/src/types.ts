import { ConstraintResult } from '@betterer/constraints';

import { BettererConfig } from './config';

export type MaybeAsync<T> = T | Promise<T>;

export type BettererTest<T> = (config: BettererConfig) => MaybeAsync<T>;

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
  diff: BettererDiff<TestType, SerialisedType>;
  skip?: boolean;
  only?: boolean;
};

export type BettererTests = {
  [key: string]: Betterer<unknown, unknown>;
};

export type BettererResult = {
  timestamp: number;
  value: unknown;
};

export type BettererResults = Record<string, BettererResult>;
