import React, { FC, memo } from 'react';

import { BettererContext, BettererFilePaths, BettererRuns } from '@betterer/betterer';
import { Box, Text } from 'ink';

import { filesChecking } from '../../messages';
import { Config, ConfigEditField } from '../config';
import { Runs } from '../runs';

import { WatchInstructions } from './WatchInstructions';

export type WatchRunningProps = {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  runs: BettererRuns;
};

export const WatchRunning: FC<WatchRunningProps> = memo(function WatchRunning(props) {
  const { context, editField, filePaths, runs } = props;

  return (
    <>
      <Config context={context} editField={editField} />
      {filePaths.length ? (
        <>
          <Box paddingBottom={1}>
            <Text>{filesChecking(filePaths.length)}</Text>
          </Box>
          <Box flexDirection="column" paddingBottom={1}>
            {filePaths.map((filePath) => (
              <Text key={filePath}>・ {filePath}</Text>
            ))}
          </Box>
        </>
      ) : null}
      <Runs runs={runs} />
      <WatchInstructions />
    </>
  );
});
