import React, { FC, memo } from 'react';

import { Box, Text } from 'ink';

import { watchStart } from '../../messages';
import { BettererContext } from '@betterer/betterer';
import { Config, ConfigEditField } from '../config';
import { WatchInstructions } from './WatchInstructions';

export type WatchStartingProps = {
  context: BettererContext;
  editField: ConfigEditField;
};

export const WatchStarting: FC<WatchStartingProps> = memo(function WatchStarting(props) {
  const { context, editField } = props;
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <Config context={context} editField={editField} />
      <Box paddingBottom={1}>
        <Text>{watchStart()}</Text>
      </Box>
      <WatchInstructions />
    </Box>
  );
});
