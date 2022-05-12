import { React, Box, FC, Text, memo } from '@betterer/render';

export const WatchInstructions: FC = memo(function WatchInstructions() {
  return (
    <Box paddingBottom={1}>
      <Text>(press "q" to quit)</Text>
    </Box>
  );
});
