import React, { FC, memo } from 'react';

import { Suite } from '../suite';
import { BettererReporterState } from '../../state';

export const DefaultReporter: FC<BettererReporterState> = memo(function DefaultReporter(props: BettererReporterState) {
  const { context, done, suiteSummary } = props;
  const suite = props.suite || props.suiteSummary;

  if (!suite) {
    return null;
  }

  return <Suite context={context} suite={suite} suiteSummary={suiteSummary} done={done} />;
});
