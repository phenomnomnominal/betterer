import React, { FC, useEffect, useState, useReducer } from 'react';
import { Box } from 'ink';

import { INITIAL_STATE, reducer, BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskStatusMessage } from './types';

export type BettererTasksProps = {
  name: string;
};

export const BettererTasks: FC<BettererTasksProps> = function BettererTask({ children, name }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [status, setStatus] = useState<BettererTaskStatusMessage | null>(null);

  useEffect(() => {
    const { done, error, running } = state;
    const runningStatus = running ? `${running} running... ` : '';
    const doneStatus = done ? `${done} done. ` : '';
    const errorStatus = error ? `${error} errored! ` : '';
    const result = `${runningStatus}${doneStatus}${errorStatus}`;
    if (state.error > 0) {
      setStatus(['💥', 'redBright', result]);
      return;
    }
    if (state.running === 0) {
      setStatus(['✅', 'greenBright', result]);
      return;
    }
    setStatus(['🌟', 'whiteBright', result]);
  }, [state]);

  return (
    <BettererTasksContext.Provider value={dispatch}>
      <Box flexDirection="column">
        <BettererTaskStatus name={name} status={status} />
        {children}
      </Box>
    </BettererTasksContext.Provider>
  );
};
