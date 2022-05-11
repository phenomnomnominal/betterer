import React, { FC, memo } from 'react';

import { Box, Text } from 'ink';

export const WatchInstructions: FC = memo(function WatchInstructions() {
  return (
    <Box paddingBottom={1}>
      <Text>(press "q" to quit)</Text>
    </Box>
  );
});
