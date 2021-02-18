import React, { FC, memo } from 'react';

import { BettererContext, BettererRuns, BettererSummary } from '@betterer/betterer';

import { DefaultEnding } from './DefaultEnding';
import { DefaultRunning } from './DefaultRunning';

export type DefaultReporterProps = {
  context: BettererContext;
  runs?: BettererRuns;
  summary?: BettererSummary;
};

export const DefaultReporter: FC<DefaultReporterProps> = memo(function DefaultReporter(props: DefaultReporterProps) {
  const { context, runs, summary } = props;

  if (runs && !summary) {
    return <DefaultRunning runs={runs} />;
  }
  if (runs && summary) {
    return <DefaultEnding context={context} runs={runs} summary={summary} />;
  }
  return null;
});
