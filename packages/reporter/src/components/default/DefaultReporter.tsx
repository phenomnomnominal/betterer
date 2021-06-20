import React, { FC, memo } from 'react';

import { BettererContext, BettererRuns, BettererSummary } from '@betterer/betterer';

import { Runs, RunSummary } from '../runs';

export type DefaultReporterProps = {
  context: BettererContext;
  runs?: BettererRuns;
  summary?: BettererSummary;
};

export const DefaultReporter: FC<DefaultReporterProps> = memo(function DefaultReporter(props: DefaultReporterProps) {
  const { context, runs, summary } = props;

  return (
    <>
      {runs && <Runs runs={runs} />}
      {summary && <RunSummary context={context} summary={summary} />}
    </>
  );
});
