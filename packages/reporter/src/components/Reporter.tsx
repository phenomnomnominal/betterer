import React, { FC } from 'react';

import { BettererRuns, BettererSummary } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererLogo } from '@betterer/logger';
import { Box } from 'ink';

import { Error } from './Error';
import { Runs } from './Runs';
import { Summary } from './Summary';

export type ReporterProps = {
  error?: BettererError;
  runs?: BettererRuns;
  summary?: BettererSummary;
};

export const Reporter: FC<ReporterProps> = function Reporter({ error, runs, summary }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo></BettererLogo>
      {runs && <Runs runs={runs} />}
      {summary && <Summary summary={summary} />}
      {error && <Error error={error} />}
    </Box>
  );
};
