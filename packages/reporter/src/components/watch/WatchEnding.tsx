import React, { FC } from 'react';

import { Box, Text } from 'ink';

import { watchEnd } from '../../messages';

export const WatchEnding: FC = function WatchEnding() {
  return (
    <Box paddingBottom={1}>
      <Text>{watchEnd()}</Text>
    </Box>
  );
};
