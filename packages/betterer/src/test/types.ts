import { BettererConstraintResult } from '@betterer/constraints';
import { BettererLogger } from '@betterer/logger';

import { BettererRun } from '../context';
import { BettererResultValue } from '../results';
import { MaybeAsync } from '../types';

export type BettererTestFunction<DeserialisedType extends BettererResultValue> = (
  run: BettererRun
) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType extends BettererResultValue> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

export type BettererTestGoal<DeserialisedType extends BettererResultValue> = (
  result: DeserialisedType
) => MaybeAsync<boolean>;

export type BettererDiff<DeserialisedType extends BettererResultValue = BettererResultValue, DiffType = null> = {
  expected: DeserialisedType;
  result: DeserialisedType;
  diff: DiffType;
  log: (logger: BettererLogger) => Promise<void>;
};

export type BettererDiffer<DeserialisedType extends BettererResultValue, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => BettererDiff<DeserialisedType, DiffType>;

export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export type BettererSerialise<DeserialisedType extends BettererResultValue, SerialisedType> = (
  result: DeserialisedType
) => SerialisedType;

export type BettererDeserialise<DeserialisedType extends BettererResultValue, SerialisedType> = (
  serialised: SerialisedType
) => DeserialisedType;

export type BettererSerialiser<DeserialisedType extends BettererResultValue, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestConfigBasicPartial = {
  constraint: BettererTestConstraint<number>;
  test: BettererTestFunction<number>;
  goal?: number | BettererTestGoal<number>;
  deadline?: Date | string;
};

export type BettererTestConfigComplexPartial<DeserialisedType extends BettererResultValue, SerialisedType, DiffType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  goal: DeserialisedType | BettererTestGoal<DeserialisedType>;
  deadline?: Date | string;
};

export type BettererTestConfigPartial<
  DeserialisedType extends BettererResultValue = BettererResultValue,
  SerialisedType = DeserialisedType,
  DiffType = null
> = BettererTestConfigBasicPartial | BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType>;

export type BettererTestConfig<
  DeserialisedType extends BettererResultValue = BettererResultValue,
  SerialisedType = DeserialisedType,
  DiffType = null
> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline: number;
  goal: BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export interface BettererTestBase<
  DeserialisedType extends BettererResultValue = BettererResultValue,
  SerialisedType = DeserialisedType,
  DiffType = null
> {
  isBettererTest: 'isBettererTest';
  config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  isOnly: boolean;
  isSkipped: boolean;
  only(): this;
  skip(): this;
}

export type BettererTestMap = Record<string, BettererTestBase>;
export type BettererTestConfigMap = Record<string, BettererTestBase | BettererTestConfigPartial>;
