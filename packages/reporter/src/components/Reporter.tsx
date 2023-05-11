import { React, FC, Box, useInput, useStdin } from '@betterer/render';
import { BettererLogo } from '@betterer/tasks';

import { DefaultReporter } from './default';
import { WatchReporter } from './watch';
import { BettererReporterState } from '../state';

export const Reporter: FC<BettererReporterState> = function Reporter(props: BettererReporterState) {
  const { context } = props;

  const { isRawModeSupported } = useStdin();

  isRawModeSupported &&
    useInput((input, key) => {
      if (key.ctrl && input === 'c') {
        void context.stop();
        return;
      }
    });

  const ReporterComponent = context.config.watch ? WatchReporter : DefaultReporter;

  return (
    <Box flexDirection="column">
      {context.config.logo && <BettererLogo />}
      <ReporterComponent {...props} />
    </Box>
  );
};
