import type { FC } from '@betterer/render';

import type { BettererReporterState } from '../state/index.js';

import { React, Box, useInput, useStdin } from '@betterer/render';
import { BettererLogo } from '@betterer/tasks';

import { DefaultReporter } from './default/index.js';
import { WatchReporter } from './watch/index.js';

export const Reporter: FC<BettererReporterState> = function Reporter(props: BettererReporterState) {
  const { context } = props;

  const { isRawModeSupported } = useStdin();

  if (isRawModeSupported) {
    useInput((input, key) => {
      if (key.ctrl && input === 'c') {
        void context.stop();
        return;
      }
    });
  }

  const ReporterComponent = context.config.watch ? WatchReporter : DefaultReporter;

  return (
    <Box flexDirection="column">
      {context.config.logo && <BettererLogo />}
      <ReporterComponent {...props} />
    </Box>
  );
};
