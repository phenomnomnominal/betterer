import { BettererConstraintResult } from '@betterer/constraints';
import { BettererLogs } from '@betterer/logger';

import { BettererDelta } from '../context';
import { BettererRun } from '../run';
import { MaybeAsync } from '../types';

export type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export type BettererTestConstraint<DeserialisedType> = (
  result: DeserialisedType,
  expected: DeserialisedType
) => MaybeAsync<BettererConstraintResult>;

export type BettererTestDeadline = Date | string;

export type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export type BettererDiff<DiffType = null> = {
  diff: DiffType;
  logs: BettererLogs;
};

export type BettererDiffer<DeserialisedType, DiffType> = (
  expected: DeserialisedType,
  result: DeserialisedType
) => BettererDiff<DiffType>;

export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export type BettererProgress<DeserialisedType> = (
  baseline: DeserialisedType | null,
  result: DeserialisedType | null
) => MaybeAsync<BettererDelta | null>;

export type BettererSerialise<DeserialisedType, SerialisedType> = (
  result: DeserialisedType,
  resultsPath: string
) => SerialisedType;

export type BettererDeserialise<DeserialisedType, SerialisedType> = (
  serialised: SerialisedType,
  resultsPath: string
) => DeserialisedType;

export type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
  serialise: BettererSerialise<DeserialisedType, SerialisedType>;
  deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestOptionsBasic = {
  constraint: BettererTestConstraint<number>;
  test: BettererTestFunction<number>;
  goal?: number | BettererTestGoal<number>;
  deadline?: BettererTestDeadline;
};

export type BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> = {
  constraint: BettererTestConstraint<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer?: BettererPrinter<SerialisedType>;
  progress?: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
  goal: DeserialisedType | BettererTestGoal<DeserialisedType>;
  deadline?: BettererTestDeadline;
};

export type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> =
  | BettererTestOptionsBasic
  | BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;

export type BettererTestConfig<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> = {
  configPath: string;
  constraint: BettererTestConstraint<DeserialisedType>;
  deadline: number;
  goal: BettererTestGoal<DeserialisedType>;
  test: BettererTestFunction<DeserialisedType>;
  differ: BettererDiffer<DeserialisedType, DiffType>;
  printer: BettererPrinter<SerialisedType>;
  progress: BettererProgress<DeserialisedType>;
  serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export interface BettererTestBase<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> {
  config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  isOnly: boolean;
  isSkipped: boolean;
  constraint(constraintOverride: BettererTestConstraint<DeserialisedType>): this;
  goal(goalOverride: BettererTestGoal<DeserialisedType>): this;
  only(): this;
  skip(): this;
}

export type BettererTestFactory = () => MaybeAsync<BettererTestBase>;
export type BettererTestFactoryMeta = {
  readonly configPath: string;
  readonly factory: BettererTestFactory;
  readonly name: string;
};
export type BettererTestFactoryMetaMap = Record<string, BettererTestFactoryMeta>;
export type BettererTestMap = Record<string, BettererTestFactory>;

export type BettererTestMeta = {
  readonly configPath: string;
  readonly name: string;
  readonly isFileTest: boolean;
  readonly isOnly: boolean;
  readonly isSkipped: boolean;
} & (
  | {
      readonly isNew: true;
      readonly baselineJSON: null;
      readonly expectedJSON: null;
    }
  | {
      readonly isNew: false;
      readonly baselineJSON: string;
      readonly expectedJSON: string;
    }
);
