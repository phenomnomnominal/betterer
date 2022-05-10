import { React, Box, FC, Text, memo } from '@betterer/render';

import { watchEnd } from '../../messages';

export const WatchEnding: FC = memo(function WatchEnding() {
  return (
    <Box paddingBottom={1}>
      <Text>{watchEnd()}</Text>
    </Box>
  );
});
