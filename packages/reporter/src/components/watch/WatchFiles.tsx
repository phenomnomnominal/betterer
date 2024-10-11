import type { BettererContext, BettererFilePaths } from '@betterer/betterer';
import type { FC } from '@betterer/render';

import type { ConfigEditField } from '../config/index.js';

import { React, Box, Text, memo } from '@betterer/render';

import { filesChecked, filesChecking, testsChanged } from '../../messages.js';
import { Config } from '../config/index.js';

/** @knipignore used by an exported function */
export interface WatchFilesProps {
  context: BettererContext;
  editField: ConfigEditField;
  filePaths: BettererFilePaths;
  running: boolean;
}

export const WatchFiles: FC<WatchFilesProps> = memo(function WatchFiles(props) {
  const { context, editField, filePaths, running } = props;

  const isTestChange = context.config.configPaths.some((configPath) => filePaths.includes(configPath));

  return (
    <>
      <Config context={context} editField={editField} />
      {filePaths.length ? (
        <>
          {isTestChange ? (
            <Box paddingBottom={1}>
              <Text>{testsChanged()}</Text>
            </Box>
          ) : (
            <Box paddingBottom={1}>
              <Text>{running ? filesChecking(filePaths.length) : filesChecked(filePaths.length)}</Text>
            </Box>
          )}
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
