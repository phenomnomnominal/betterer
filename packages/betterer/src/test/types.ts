import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';
import { BettererTest } from './test';

export type BettererTests = ReadonlyArray<BettererTest>;

export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<ConstraintResult>;

export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export type BettererTestStateOptions = {
  isOnly?: boolean;
  isSkipped?: boolean;
};

export type BettererDiffer = (run: BettererRun) => void;
export type BettererPrinter<SerialisedType> = (run: BettererRun, serialised: SerialisedType) => MaybeAsync<string>;

export type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (
  run: BettererRun,
  result: DeserialisedType
) => SerialisedType;
export type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (
  run: BettererRun,
  serialised: SerialisedType
) => DeserialisedType;
export type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestType<DeserialisedType, SerialisedType = DeserialisedType> = {
  differ?: BettererDiffer;
  printer?: BettererPrinter<SerialisedType>;
  serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export type BettererTestOptions<DeserialisedType, SerialisedType = DeserialisedType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
} & BettererTestType<DeserialisedType, SerialisedType> &
  BettererTestStateOptions;
export type BettererTestMap = Record<string, BettererTest>;
