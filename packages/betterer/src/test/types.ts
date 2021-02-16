import { BettererConstraintResult } from '@betterer/constraints';
import { BettererLogger } from '@betterer/logger';

import { BettererRun } from '../context';
import { BettererDelta } from '../context/types';
import { MaybeAsync } from '../types';
import { BettererTestType } from './type';

export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export type BettererDiff<DeserialisedType = unknown, DiffType = null> = {
  expected: DeserialisedType;
  result: DeserialisedType;
  diff: DiffType;
  log: (logger: BettererLogger) => Promise<void>;
};

export type BettererDiffer<DeserialisedType, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => BettererDiff<DeserialisedType, DiffType>;

export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export type BettererProgress<DeserialisedType> = (
  baseline: DeserialisedType | null,
  result: DeserialisedType | null
) => MaybeAsync<BettererDelta | null>;

export type BettererSerialise<DeserialisedType, SerialisedType> = (result: DeserialisedType) => SerialisedType;

export type BettererDeserialise<DeserialisedType, SerialisedType> = (serialised: SerialisedType) => DeserialisedType;

export type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestConfigBasicPartial = {
  constraint: BettererTestConstraint<number>;
  test: BettererTestFunction<number>;
  goal?: number | BettererTestGoal<number>;
  deadline?: Date | string;
};

export type BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer?: BettererPrinter<SerialisedType>;
  progress?: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  goal: DeserialisedType | BettererTestGoal<DeserialisedType>;
  deadline?: Date | string;
};

export type BettererTestConfigPartial<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> =
  | BettererTestConfigBasicPartial
  | BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType>;

export type BettererTestConfig<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline: number;
  goal?: BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  progress?: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  type: BettererTestType;
};

export interface BettererTestBase<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> {
  config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  isOnly: boolean;
  isSkipped: boolean;
  only(): this;
  skip(): this;
}

export type BettererTestMap = Record<string, BettererTestBase>;
export type BettererTestConfigMap = Record<string, BettererTestBase | BettererTestConfigPartial>;
