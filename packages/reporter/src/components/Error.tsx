import React, { FC, useEffect } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererErrorLog } from '@betterer/logger';
import { useApp } from 'ink';

export type ErrorProps = {
  error: BettererError;
};

export const Error: FC<ErrorProps> = function Error({ error }) {
  const app = useApp();
  useEffect(() => {
    setImmediate(() => app.exit());
  }, [app]);

  return <BettererErrorLog error={error} />;
};
