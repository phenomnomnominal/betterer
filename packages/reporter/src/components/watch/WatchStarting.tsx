import { React, Box, FC, Text, memo } from '@betterer/render';

import { watchStart } from '../../messages';
import { BettererContext } from '@betterer/betterer';
import { Config, ConfigEditField } from '../config';
import { WatchInstructions } from './WatchInstructions';

export interface WatchStartingProps {
  context: BettererContext;
  editField: ConfigEditField;
}

export const WatchStarting: FC<WatchStartingProps> = memo(function WatchStarting(props) {
  const { context, editField } = props;

  return (
    <Box flexDirection="column">
      <Config context={context} editField={editField} />
      <Box paddingBottom={1}>
        <Text>{watchStart()}</Text>
      </Box>
      <WatchInstructions />
    </Box>
  );
});
