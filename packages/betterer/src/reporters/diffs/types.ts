import { MaybeAsync } from '../../types';

export type BettererDiffReporter<TestType = unknown> = (
  current: TestType,
  previous: TestType | null
) => MaybeAsync<void>;
