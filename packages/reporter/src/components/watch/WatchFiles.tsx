import type { BettererContext, BettererSuite } from '@betterer/betterer';
import type { FC } from '@betterer/render';

import type { ConfigEditField } from '../config/index.js';

import { React, Box, Text, memo } from '@betterer/render';

import { filesChecked, filesChecking, testsChanged } from '../../messages.js';
import { Config } from '../config/index.js';

export interface WatchFilesProps {
  context: BettererContext;
  editField: ConfigEditField;
  suite: BettererSuite;
  running: boolean;
}

export const WatchFiles: FC<WatchFilesProps> = memo(function WatchFiles(props) {
  const { context, editField, suite, running } = props;
  const { filePaths } = suite;

  const isTestChange = context.config.configPaths.some((configPath) => filePaths.includes(configPath));

  return (
    <>
      <Config context={context} editField={editField} />
      {filePaths?.length ? (
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
