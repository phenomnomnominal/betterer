import { MaybeAsync } from '../../types';

export type BettererDiff<TestType = unknown, SerialisedType = TestType> = (
  current: TestType,
  serialisedCurrent: SerialisedType,
  serialisedPrevious: SerialisedType | null
) => MaybeAsync<void>;
