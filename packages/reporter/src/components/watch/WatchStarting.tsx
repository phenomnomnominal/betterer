import React, { FC } from 'react';

import { Box, Text } from 'ink';

import { watchStart } from '../../messages';

export const WatchStarting: FC = function WatchStarting() {
  return (
    <Box paddingBottom={1}>
      <Text>{watchStart()}</Text>
    </Box>
  );
};
