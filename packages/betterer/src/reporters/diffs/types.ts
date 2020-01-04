import { MaybeAsync } from '../../types';

export type BettererDiffReporter<
  TestType = unknown,
  SerialisedType = TestType
> = (
  current: TestType,
  serialisedCurrent: SerialisedType,
  serialisedPrevious: SerialisedType | null
) => MaybeAsync<void>;
