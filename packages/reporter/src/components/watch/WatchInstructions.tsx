import type { FC } from '@betterer/render';

import { React, Box, Text, memo } from '@betterer/render';

export const WatchInstructions: FC = memo(function WatchInstructions() {
  return (
    <Box paddingBottom={1}>
      <Text>(press "q" to quit)</Text>
    </Box>
  );
});
