import React, { FC, memo } from 'react';

import { BettererContext, BettererRuns, BettererRunSummaries, BettererSummary } from '@betterer/betterer';

import { Runs, RunSummary } from '../runs';

export type DefaultReporterProps = {
  context: BettererContext;
  runs?: BettererRuns;
  runSummaries?: BettererRunSummaries;
  summary?: BettererSummary;
};

export const DefaultReporter: FC<DefaultReporterProps> = memo(function DefaultReporter(props: DefaultReporterProps) {
  const { context, runs, runSummaries, summary } = props;

  return (
    <>
      {(runs || runSummaries) && <Runs runs={runs} runSummaries={runSummaries} />}
      {summary && <RunSummary context={context} summary={summary} />}
    </>
  );
});
