import { BettererError } from '@betterer/errors';
import { React, FC, Box } from '@betterer/render';
import { BettererErrorLog, BettererLogo } from '@betterer/tasks';

export interface ErrorProps {
  error: BettererError;
  logo: boolean;
}

export const Error: FC<ErrorProps> = function Error(props: ErrorProps) {
  const { error, logo } = props;

  return (
    <Box flexDirection="column" paddingBottom={1}>
      {logo && <BettererLogo />}
      <BettererErrorLog error={error} />
    </Box>
  );
};
