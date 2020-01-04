import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';

export type BettererOptions<TestType = unknown, SerialisedType = TestType> = {
  constraint: BettererConstraint<SerialisedType>;
  test: BettererTestFunction<TestType>;
  goal?: BettererGoal<SerialisedType>;
  isSkipped?: boolean;
  isOnly?: boolean;
};

export type BettererTestFunction<TestType = unknown> = (
  run: BettererRun
) => MaybeAsync<TestType>;

export type BettererConstraint<SerialisedType = unknown> = (
  current: SerialisedType,
  previous: SerialisedType
) => MaybeAsync<ConstraintResult>;

export type BettererDiff<
  TestType = unknown,
  SerialisedType = TestType,
  DiffType = void
> = (
  current: TestType,
  serialisedCurrent: SerialisedType,
  serialisedPrevious: SerialisedType | null
) => MaybeAsync<DiffType>;

export type BettererGoal<SerialisedType = unknown> = (
  current: SerialisedType
) => MaybeAsync<boolean>;

export type BettererGoalValue<SerialisedType = unknown> =
  | SerialisedType
  | BettererGoal<SerialisedType>;
