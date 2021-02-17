import React, { FC, memo } from 'react';

import { BettererContext, BettererRuns, BettererSummary } from '@betterer/betterer';

import { Runs, RunSummary } from '../runs';

export type DefaultEndingProps = {
  context: BettererContext;
  runs: BettererRuns;
  summary: BettererSummary;
};

export const DefaultEnding: FC<DefaultEndingProps> = memo(function DefaultEnding(props) {
  const { context, runs, summary } = props;
  return (
    <>
      <Runs runs={runs} />
      <RunSummary context={context} summary={summary} />
    </>
  );
});
