import { ConstraintResult } from '@betterer/constraints';

import { BettererRun } from '../context';
import { MaybeAsync } from '../types';
import { BettererTest } from './test';

export type BettererTests = ReadonlyArray<BettererTest>;

export type BettererTestFunction<ResultType> = (run: BettererRun) => MaybeAsync<ResultType>;

export type BettererTestConstraint<ResultType, DeserialisedType = ResultType> = (
    result: ResultType,
    expected: DeserialisedType
) => MaybeAsync<ConstraintResult>;

export type BettererTestGoal<ResultType> = (result: ResultType) => MaybeAsync<boolean>;

export type BettererTestStateOptions = {
    isOnly?: boolean;
    isSkipped?: boolean;
}

export type BettererDiffer = (run: BettererRun) => void;
export type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export type BettererSerialise<ResultType, DeserialisedType = ResultType, SerialisedType = ResultType> = (result: ResultType | DeserialisedType) => SerialisedType;
export type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (serialised: SerialisedType) => DeserialisedType
export type BettererSerialiser<ResultType, DeserialisedType = ResultType, SerialisedType = ResultType> = {
    serialise: BettererSerialise<ResultType, DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export type BettererTestType<ResultType, DeserialisedType = ResultType, SerialisedType = ResultType> = {
    differ?: BettererDiffer;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<ResultType, DeserialisedType, SerialisedType>
}

export type BettererTestOptions<ResultType, DeserialisedType = ResultType, SerialisedType = ResultType> = {
    constraint: BettererTestConstraint<ResultType, DeserialisedType>
    goal?: ResultType | BettererTestGoal<ResultType>;
    test: BettererTestFunction<ResultType>;
}
    & BettererTestType<ResultType, DeserialisedType, SerialisedType>
    & BettererTestStateOptions;
