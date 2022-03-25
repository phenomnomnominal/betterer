import React, { FC, memo } from 'react';

import { BettererSuite } from '@betterer/betterer';
import { Box, Text } from 'ink';

import { filesChecked, filesChecking } from '../../messages';

export interface DefaultFilesProps {
  suite: BettererSuite;
  running: boolean;
}

export const DefaultFiles: FC<DefaultFilesProps> = memo(function DefaultFiles(props) {
  const { suite, running } = props;
  const { filePaths } = suite;

  return (
    <>
      {filePaths.length ? (
        <>
          <Box paddingBottom={1}>
            <Text>{running ? filesChecking(filePaths.length) : filesChecked(filePaths.length)}</Text>
          </Box>
          <Box flexDirection="column" paddingBottom={1}>
            {filePaths.map((filePath) => (
              <Text key={filePath}>・ {filePath}</Text>
            ))}
          </Box>
        </>
      ) : null}
    </>
  );
});
