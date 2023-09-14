import type { FC } from '@betterer/render';

import type { BettererTaskLog } from './types.js';

import { React, Text } from '@betterer/render';

export interface BettererTaskStatusProps {
  name: string;
  status: BettererTaskLog;
}

export const BettererTaskStatus: FC<BettererTaskStatusProps> = function BettererTaskStatus({ name, status }) {
  const [indicator, colour, message] = status;

  return (
    <Text>
      {indicator}
      <Text color={colour}> {name}: </Text>
      {message}
    </Text>
  );
};
