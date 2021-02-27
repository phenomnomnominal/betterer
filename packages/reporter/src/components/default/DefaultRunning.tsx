import React, { FC, memo } from 'react';

import { BettererRuns } from '@betterer/betterer';

import { Runs } from '../runs';

export type DefaultRunningProps = {
  runs: BettererRuns;
};

export const DefaultRunning: FC<DefaultRunningProps> = memo(function DefaultRunning(props) {
  const { runs } = props;
  return <Runs runs={runs} />;
});
