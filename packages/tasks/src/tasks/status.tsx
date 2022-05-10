import { React, FC, Text } from '@betterer/render';

import { BettererTaskLog } from './types';

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
