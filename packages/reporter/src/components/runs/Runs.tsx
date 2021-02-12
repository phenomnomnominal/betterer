import React, { FC, memo } from 'react';

import { BettererRuns } from '@betterer/betterer';
import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';

import { getRunner } from './runner';

export type RunsProps = {
  runs: BettererRuns;
  reset?: boolean;
};

export const Runs: FC<RunsProps> = memo(function Runs({ runs }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererTasks name="Betterer" statusMessage={statusMessage} ref={runs} exit={false}>
        {runs.map((run) => (
          <BettererTask key={run.name} name={run.name} runner={getRunner(run)} />
        ))}
      </BettererTasks>
    </Box>
  );
});

function statusMessage(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
