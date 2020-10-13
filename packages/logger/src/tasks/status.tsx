import React, { FC } from 'react';
import { Text } from 'ink';

import { BettererTaskStatusMessage } from './types';

export type BettererTaskStatusProps = {
  name: string;
  status: BettererTaskStatusMessage | null;
};

export const BettererTaskStatus: FC<BettererTaskStatusProps> = function BettererTaskStatus({ name, status }) {
  if (!status) {
    return null;
  }

  const [indicator, colour, message] = status;

  return (
    <Text>
      {indicator}
      <Text color={colour}> {name}: </Text>
      {message}
    </Text>
  );
};
