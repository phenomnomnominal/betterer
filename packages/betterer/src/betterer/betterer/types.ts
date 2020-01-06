import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../../context';
import { MaybeAsync } from '../../types';

export type BettererOptions<TestType = unknown> = {
  constraint: BettererConstraint<TestType>;
  test: BettererTestFunction<TestType>;
  goal?: BettererGoalValue<TestType>;
  isSkipped?: boolean;
  isOnly?: boolean;
};

export type BettererTestFunction<TestType = unknown> = (run: BettererRun) => MaybeAsync<TestType>;

export type BettererConstraint<TestType = unknown> = (
  current: TestType,
  previous: TestType
) => MaybeAsync<ConstraintResult>;

export type BettererGoal<TestType = unknown> = (current: TestType) => MaybeAsync<boolean>;

export type BettererGoalValue<TestType = unknown> = TestType | BettererGoal<TestType>;
