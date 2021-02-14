import React, { FC, memo } from 'react';

import { BettererRuns, BettererSummary } from '@betterer/betterer';

import { Runs, RunSummary } from '../runs';

export type DefaultEndingProps = {
  runs: BettererRuns;
  summary: BettererSummary;
};

export const DefaultEnding: FC<DefaultEndingProps> = memo(function DefaultEnding(props) {
  const { runs, summary } = props;
  return (
    <>
      <Runs runs={runs} />
      <RunSummary summary={summary} />
    </>
  );
});
