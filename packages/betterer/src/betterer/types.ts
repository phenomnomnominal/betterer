import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';

export type BettererOptions<TestType = unknown, SerialisedType = TestType> = {
  constraint: BettererConstraintFunction<SerialisedType>;
  test: BettererTestFunction<TestType>;
  goal: BettererGoal<SerialisedType>;
  isSkipped?: boolean;
  isOnly?: boolean;
};

export type BettererTestFunction<TestType = unknown> = (
  run: BettererRun
) => MaybeAsync<TestType>;

export type BettererConstraintFunction<SerialisedType = unknown> = (
  current: SerialisedType,
  previous: SerialisedType
) => MaybeAsync<ConstraintResult>;

export type BettererGoalFunction<SerialisedType = unknown> = (
  current: SerialisedType
) => MaybeAsync<boolean>;

export type BettererGoal<SerialisedType = unknown> =
  | SerialisedType
  | BettererGoalFunction<SerialisedType>;
