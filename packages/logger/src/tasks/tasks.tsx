import React, { FC, useEffect, useState, useReducer } from 'react';
import { Box, useApp } from 'ink';

import { INITIAL_STATE, reducer, BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskStatusMessage } from './types';

export type BettererTasksProps = {
  name: string;
};

export const BettererTasks: FC<BettererTasksProps> = function BettererTask({ children, name }) {
  const app = useApp();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [status, setStatus] = useState<BettererTaskStatusMessage | null>(null);

  useEffect(() => {
    const { done, error, running } = state;
    const runningStatus = running ? `${running} tasks running... ` : '';
    const doneStatus = done ? `${done} tasks done! ` : '';
    const errorStatus = error ? `${error} tasks errored! ` : '';
    const result = `${runningStatus}${doneStatus}${errorStatus}`;
    let status: BettererTaskStatusMessage = ['🌟', 'whiteBright', result];
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
