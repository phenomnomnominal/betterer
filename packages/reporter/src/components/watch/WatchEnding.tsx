import React, { FC, memo } from 'react';

import { Box, Text } from 'ink';

import { watchEnd } from '../../messages';

export const WatchEnding: FC = memo(function WatchEnding() {
  return (
    <Box paddingBottom={1}>
      <Text>{watchEnd()}</Text>
    </Box>
  );
});
