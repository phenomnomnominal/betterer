import React, { FC } from 'react';
import { Text } from 'ink';

import { BettererLoggerTaskStatus } from './types';

export type BettererLoggerStatusProps = {
  name: string;
  status: BettererLoggerTaskStatus;
};

export const BettererLoggerStatus: FC<BettererLoggerStatusProps> = function BettererLoggerStatus({ name, status }) {
  const [indicator, colour, message] = status;

  return (
    <Text>
      {indicator}
      <Text color={colour}> {name}: </Text>
      {message}
    </Text>
  );
};
