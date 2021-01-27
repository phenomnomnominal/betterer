import { BettererError, isBettererError } from '@betterer/errors';
import { Box, Text } from 'ink';
import React, { FC } from 'react';

export type BettererTaskErrorProps = {
  error: Error | BettererError;
};

let errorCount = 0;
let detailCount = 0;

export const BettererTaskError: FC<BettererTaskErrorProps> = function BettererTaskError({ error }) {
  let errors: Array<Error | BettererError> = [];
  let details: Array<string> = [];
  if (isBettererError(error)) {
    errors = error.details.filter((detail) => isError(detail)) as Array<Error | BettererError>;
    details = error.details.filter((detail) => !isError(detail)) as Array<string>;
  }
  return (
    <>
      <Box flexDirection="column" paddingTop={1}>
        <Box>
          <Text color="redBright">Error: </Text>
          <Text>{error.message}</Text>
        </Box>
        {error.stack && (
          <Box paddingLeft={2} paddingTop={1}>
            <Text>{error.stack}</Text>
          </Box>
        )}
        {details.map((detail) => (
          <Box key={detailCount++} paddingTop={1}>
            <Text>{detail.trim()}</Text>
          </Box>
        ))}
      </Box>
      {errors.map((error) => (
        <BettererTaskError key={errorCount++} error={error} />
      ))}
    </>
  );
};

function isError(value: unknown): value is Error | BettererError {
  return (value as Error).message != null && (value as Error).stack !== null;
}
