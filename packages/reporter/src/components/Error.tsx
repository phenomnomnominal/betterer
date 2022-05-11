import React, { FC } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererErrorLog, BettererLogo } from '@betterer/tasks';
import { Box } from 'ink';

export interface ErrorProps {
  error: BettererError;
}

export const Error: FC<ErrorProps> = function Error({ error }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo />
      <BettererErrorLog error={error} />
    </Box>
  );
};
