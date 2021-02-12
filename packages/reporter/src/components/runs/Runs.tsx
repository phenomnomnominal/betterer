import React, { FC, memo } from 'react';

import { BettererRuns } from '@betterer/betterer';
import { BettererTasksLogger, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';

import { getTasks } from './tasks';

export type RunsProps = {
  runs: BettererRuns;
};

export const Runs: FC<RunsProps> = memo(function Runs({ runs }) {
  debugger;
  return (
    <Box flexDirection="column">
      <BettererTasksLogger name="Betterer" update={update} tasks={getTasks(runs)} exit={false} />
    </Box>
  );
});

function update(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
