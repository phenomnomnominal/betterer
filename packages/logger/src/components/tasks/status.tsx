import { Text } from 'ink';
import React, { FC } from 'react';

import { BettererTaskLog } from './types';

export type BettererTaskStatusProps = {
  name: string;
  status: BettererTaskLog | null;
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
