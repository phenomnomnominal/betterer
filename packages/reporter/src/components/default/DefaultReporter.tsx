import React, { FC, memo } from 'react';

import { BettererRuns, BettererSummary } from '@betterer/betterer';

import { DefaultEnding } from './DefaultEnding';
import { DefaultRunning } from './DefaultRunning';

export type DefaultReporterProps = {
  runs?: BettererRuns;
  summary?: BettererSummary;
};

export const DefaultReporter: FC<DefaultReporterProps> = memo(function DefaultReporter(props: DefaultReporterProps) {
  const { runs, summary } = props;

  if (runs && !summary) {
    return <DefaultRunning runs={runs} />;
  }
  if (runs && summary) {
    return <DefaultEnding runs={runs} summary={summary} />;
  }
  return null;
});
