import React, { FC, memo } from 'react';

import { BettererContext, BettererFilePaths } from '@betterer/betterer';
import { Box, Text } from 'ink';

import { filesChecked, filesChecking } from '../../messages';
import { Config, ConfigEditField } from '../config';

export type WatchFilesProps = {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  running: boolean;
};

export const WatchFiles: FC<WatchFilesProps> = memo(function WatchFiles(props) {
  const { context, editField, filePaths, running } = props;

  return (
    <>
      <Config context={context} editField={editField} />
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
