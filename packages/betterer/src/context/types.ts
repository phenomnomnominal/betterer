import { BettererRun } from './run';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererTestNames = Array<string>;

export type Resolve = Parameters<ConstructorParameters<typeof Promise>[0]>[0];
