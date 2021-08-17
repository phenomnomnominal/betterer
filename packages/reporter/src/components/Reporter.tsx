import React, { FC } from 'react';

import { BettererLogo } from '@betterer/tasks';
import { Box } from 'ink';

import { DefaultReporter } from './default';
import { WatchReporter } from './watch';
import { BettererReporterState } from '../state';

export const Reporter: FC<BettererReporterState> = function Reporter(props: BettererReporterState) {
  const { context } = props;

  const ReporterComponent = context.config.watch ? WatchReporter : DefaultReporter;

  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo></BettererLogo>
      <ReporterComponent {...props} />
    </Box>
  );
};
