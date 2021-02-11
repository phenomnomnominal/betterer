import React, { FC } from 'react';

import { BettererContext, BettererFilePaths, BettererRuns, BettererSummary } from '@betterer/betterer';
import { Box, Text } from 'ink';

import { filesChecked } from '../../messages';
import { Config, ConfigEditField } from '../config';
import { Runs, RunSummary } from '../runs';

export type WatchWatchingProps = {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  runs: BettererRuns;
  summary: BettererSummary;
};

export const WatchWatching: FC<WatchWatchingProps> = function WatchWatching(props) {
  const { context, editField, filePaths, runs, summary } = props;

  return (
    <>
      <Config context={context} editField={editField} />
      {filePaths.length ? (
        <Box paddingBottom={1}>
          <Text>{filesChecked(filePaths.length)}</Text>
        </Box>
      ) : null}
      <Runs runs={runs} />
      <RunSummary summary={summary} />
    </>
  );
};
