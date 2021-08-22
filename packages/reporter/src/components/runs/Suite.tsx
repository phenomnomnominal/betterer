import React, { FC, memo } from 'react';

import { BettererSuite } from '@betterer/betterer';
import { BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { Box } from 'ink';

import { useTask } from './tasks';

export type SuiteProps = {
  suite: BettererSuite;
};

export const Suite: FC<SuiteProps> = memo(function Runs({ suite }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererTasksLogger name="Betterer" update={update} exit={false}>
        {suite.runs.map((run) => (
          <BettererTaskLogger key={run.name} name={run.name} run={useTask(run)} />
        ))}
      </BettererTasksLogger>
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
