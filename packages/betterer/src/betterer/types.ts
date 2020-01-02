import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';

export type BettererOptions<TestType, SerialisedType> = {
  constraint: BettererConstraint<SerialisedType>;
  test: BettererTest<TestType>;
  goal: BettererGoal<SerialisedType>;
  isSkipped?: boolean;
  isOnly?: boolean;
};

export type BettererTest<T> = (run: BettererRun) => MaybeAsync<T>;

export type BettererConstraint<T> = (
  current: T,
  previous: T
) => MaybeAsync<ConstraintResult>;

export type BettererGoalFunction<SerialisedType> = (
  current: SerialisedType
) => MaybeAsync<boolean>;

export type BettererDiff<TestType, SerialisedType> = (
  current: TestType,
  serialisedCurrent: SerialisedType,
  serialisedPrevious: SerialisedType | null
) => MaybeAsync<void>;

export type BettererGoal<SerialisedType> =
  | SerialisedType
  | BettererGoalFunction<SerialisedType>;
