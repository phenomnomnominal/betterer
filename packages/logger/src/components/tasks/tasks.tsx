import React, { FC, useEffect, useState, useReducer } from 'react';
import { Box, useApp } from 'ink';

import { INITIAL_STATE, reducer, BettererTasksContext, BettererTasksState } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskLog } from './types';

export type BettererTasksProps = {
  name: string;
  statusMessage: (state: BettererTasksState) => string;
};

export const BettererTasks: FC<BettererTasksProps> = function BettererTask({ children, name, statusMessage }) {
  const app = useApp();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [status, setStatus] = useState<BettererTaskLog | null>(null);

  useEffect(() => {
    const { done, error, running } = state;
    const result = statusMessage(state);
    let status: BettererTaskLog = ['🌟', 'whiteBright', result];
    if (error > 0) {
      status = ['💥', 'redBright', result];
    } else if (running === 0) {
      status = ['🎉', 'greenBright', result];
    }
    setStatus(status);
    const shouldExit = running === 0 && (error > 0 || done > 0);
    if (shouldExit) {
      setImmediate(app.exit);
    }
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
