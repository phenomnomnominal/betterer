import React, { FC } from 'react';

import { BettererLogo } from '@betterer/tasks';
import { Box, useInput } from 'ink';

import { DefaultReporter } from './default';
import { WatchReporter } from './watch';
import { BettererReporterState } from '../state';

export const Reporter: FC<BettererReporterState> = function Reporter(props: BettererReporterState) {
  const { context } = props;

  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      void context.stop();
      return;
    }
  });

  const ReporterComponent = context.config.watch ? WatchReporter : DefaultReporter;

  return (
    <Box flexDirection="column">
      <BettererLogo />
      <ReporterComponent {...props} />
    </Box>
  );
};
