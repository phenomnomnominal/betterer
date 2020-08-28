import { BettererConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';
import { BettererTest } from './test';

export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export type BettererDiffer<DeserialisedType, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => DiffType;

export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (
  result: DeserialisedType
) => SerialisedType;

export type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (
  serialised: SerialisedType
) => DeserialisedType;

export type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestStateOptions = {
  isOnly?: boolean;
  isSkipped?: boolean;
};

export type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline?: Date | string;
  goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ?: BettererDiffer<DeserialisedType, DiffType>;
  printer?: BettererPrinter<SerialisedType>;
  serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
} & BettererTestStateOptions;

export type BettererTestMap = Record<string, BettererTest>;
export type BettererTestOptionsMap = Record<string, BettererTest | BettererTestOptions>;
