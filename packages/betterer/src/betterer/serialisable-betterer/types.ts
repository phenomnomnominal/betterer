import { Deserialiser, Serialisable } from '../types';
import { BettererOptions } from '../betterer';

export type SerialisableBettererOptions<
  TestType extends Serialisable<SerialisedType>,
  SerialisedType = unknown
> = BettererOptions<TestType> & {
  deserialise: Deserialiser<TestType, SerialisedType>;
};
