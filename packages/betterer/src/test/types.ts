import { BettererConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';
import { BettererTest } from './test';

export type BettererTests = ReadonlyArray<BettererTest>;

export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export type BettererDiffer = (run: BettererRun) => void;

export type BettererPrinter<SerialisedType> = (run: BettererRun, serialised: SerialisedType) => MaybeAsync<string>;

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

export type BettererTestOptions<DeserialisedType, SerialisedType = DeserialisedType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline?: Date | string;
  goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ?: BettererDiffer;
  printer?: BettererPrinter<SerialisedType>;
  serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
} & BettererTestStateOptions;

export type BettererTestMap = Record<string, BettererTest | BettererTestOptions<unknown, unknown>>;
