import React, { FC, memo } from 'react';

import { BettererContext, BettererFilePaths, BettererRuns, BettererSummary } from '@betterer/betterer';
import { Box, Text } from 'ink';

import { filesChecked } from '../../messages';
import { Config, ConfigEditField } from '../config';
import { Runs, RunSummary } from '../runs';
import { WatchInstructions } from './WatchInstructions';

export type WatchWatchingProps = {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  runs: BettererRuns;
  summary: BettererSummary;
};

export const WatchWatching: FC<WatchWatchingProps> = memo(function WatchWatching(props) {
  const { context, editField, filePaths, runs, summary } = props;

  return (
    <>
      <Config context={context} editField={editField} />
      {filePaths.length ? (
        <>
          <Box paddingBottom={1}>
            <Text>{filesChecked(filePaths.length)}</Text>
          </Box>
          <Box flexDirection="column" paddingBottom={1}>
            {filePaths.map((filePath) => (
              <Text key={filePath}>・ {filePath}</Text>
            ))}
          </Box>
        </>
      ) : null}
      <Runs runs={runs} />
      <RunSummary summary={summary} />
      <WatchInstructions />
    </>
  );
});
