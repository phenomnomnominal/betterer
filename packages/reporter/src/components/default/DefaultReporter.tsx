import React, { FC, memo } from 'react';

import { Runs, SuiteSummary } from '../runs';
import { BettererReporterState } from '../../state';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, runs, runSummaries, suiteSummary } = props;

  return (
    <>
      {(runs || runSummaries) && <Runs runs={runs} runSummaries={runSummaries} />}
      {suiteSummary && <SuiteSummary context={context} summary={suiteSummary} />}
    </>
  );
});
