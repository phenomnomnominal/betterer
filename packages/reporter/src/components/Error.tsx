import { BettererError } from '@betterer/errors';
import { React, FC, Box } from '@betterer/render';
import { BettererErrorLog, BettererLogo } from '@betterer/tasks';

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
