import React, { FC, memo } from 'react';

import { Suite, SuiteSummary } from '../runs';
import { BettererReporterState } from '../../state';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, done, suiteSummary } = props;
  const suite = props.suite || props.suiteSummary;

  return (
    <>
      {suite && <Suite suite={suite} done={done} />}
      {suiteSummary && <SuiteSummary context={context} suiteSummary={suiteSummary} />}
    </>
  );
});
