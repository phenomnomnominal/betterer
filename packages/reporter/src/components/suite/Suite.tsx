import type { BettererContext, BettererSuite, BettererSuiteSummary } from '@betterer/betterer';
import type { FC } from '@betterer/render';
import type { BettererTasksState } from '@betterer/tasks';

import { Box, memo, React } from '@betterer/render';
import { BettererTasksLogger } from '@betterer/tasks';

import { useReporterState } from '../../state/index.js';
import { SuiteSummary } from './SuiteSummary.js';
import { Run } from './Run.js';

/** @knipignore used by an exported function */
export interface SuiteProps {
  context: BettererContext;
  suite: BettererSuite | BettererSuiteSummary;
  suiteSummary?: BettererSuiteSummary;
}

export const Suite: FC<SuiteProps> = memo(function Suite({ context, suite, suiteSummary }) {
  const { done } = useReporterState();

  const { ci, precommit } = context.config;

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <BettererTasksLogger name="Betterer" update={update} exit={false} done={done} timer={!precommit && !ci}>
          {suite.runs.map((run) => (
            <Run key={run.name} run={run} />
          ))}
        </BettererTasksLogger>
      </Box>
      {suiteSummary ? <SuiteSummary context={context} suiteSummary={suiteSummary} /> : null}
    </>
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
  return `${String(n)} ${n === 1 ? 'test' : 'tests'}`;
}
