import React, { FC, useEffect } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererErrorLog, BettererLogo } from '@betterer/tasks';
import { Box, useApp } from 'ink';

export type ErrorProps = {
  error: BettererError;
};

export const Error: FC<ErrorProps> = function Error({ error }) {
  const app = useApp();
  useEffect(() => {
    setImmediate(() => app.exit());
  }, [app]);

  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo />
      <BettererErrorLog error={error} />
    </Box>
  );
};
