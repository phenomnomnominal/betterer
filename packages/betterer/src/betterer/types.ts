import { ConstraintResult } from '@betterer/constraints';

import { BettererConfig } from '../config';
import { MaybeAsync } from '../types';

export type BettererTest<T> = (config: BettererConfig) => MaybeAsync<T>;

export type BettererConstraint<T> = (
  current: T,
  previous: T
) => MaybeAsync<ConstraintResult>;

export type BettererGoalFunction<Serialised> = (
  current: Serialised
) => MaybeAsync<boolean>;

export type BettererGoal<Serialised> =
  | Serialised
  | BettererGoalFunction<Serialised>;

export type BettererDiff<Base, Serialised> = (
  current: Base,
  serialisedCurrent: Serialised,
  serialisedPrevious: Serialised | null
) => MaybeAsync<void>;
