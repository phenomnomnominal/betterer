import type { FC } from '@betterer/render';

import { React, Box, Text, memo } from '@betterer/render';

import { watchEnd } from '../../messages.js';

export const WatchEnding: FC = memo(function WatchEnding() {
  return (
    <Box paddingBottom={1}>
      <Text>{watchEnd()}</Text>
    </Box>
  );
});
