import React, { FC } from 'react';
import { Box, Text } from 'ink';

import { LOGO } from '../logo';

export const BettererLogo: FC = function BettererLogo() {
  return (
    <Box flexDirection="column">
      <Text color="yellowBright">{LOGO}</Text>
    </Box>
  );
};
