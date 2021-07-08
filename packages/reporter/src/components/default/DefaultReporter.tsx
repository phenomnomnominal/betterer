import React, { FC, memo } from 'react';

import { Suite, SuiteSummary } from '../runs';
import { BettererReporterState } from '../../state';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, suiteSummary } = props;
  const suite = props.suite || props.suiteSummary;

  return (
    <>
      {suite && <Suite suite={suite} />}
      {suiteSummary && <SuiteSummary context={context} suiteSummary={suiteSummary} />}
    </>
  );
});
