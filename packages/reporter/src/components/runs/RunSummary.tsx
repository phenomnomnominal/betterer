import React, { FC, memo } from 'react';

import { BettererContext, BettererSummary } from '@betterer/betterer';
import { diffΔ } from '@betterer/logger';
import { Box, Text, TextProps } from 'ink';

import {
  testBetter,
  testChecked,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testSame,
  testSkipped,
  testUpdated,
  testWorse,
  unexpectedDiff,
  updateInstructions
} from '../../messages';
import { quote } from '../../utils';

export type RunSummaryProps = {
  context: BettererContext;
  summary: BettererSummary;
};

const TEXT_COLOURS: Record<string, TextProps['color']> = {
  better: 'greenBright',
  checked: 'gray',
  completed: 'greenBright',
  diff: 'red',
  expired: 'brightRed',
  failed: 'brightRed',
  new: 'gray',
  obsolete: 'brightRed',
  same: 'brightYellow',
  skipped: 'brightYellow',
  updated: 'gray',
  worse: 'red'
};

export const RunSummary: FC<RunSummaryProps> = memo(function RunSummary({ context, summary }) {
  const better = summary.better.length;
  const failed = summary.failed.length;
  const neww = summary.new.length;
  const ran = summary.ran.length;
  const same = summary.same.length;
  const skipped = summary.skipped.length;
  const updated = summary.updated.length;
  const worse = summary.worse.length;
  const { completed, expired } = summary;

  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <Text color={TEXT_COLOURS.checked}>{testChecked(tests(ran))}</Text>
        {expired.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.expired}>
            {testExpired(quote(run.name))})
          </Text>
        ))}
        {failed ? <Text color={TEXT_COLOURS.failed}>{testFailed(tests(failed))}</Text> : null}
        {neww ? <Text color={TEXT_COLOURS.new}>{testNew(tests(neww))}</Text> : null}
        {better ? <Text color={TEXT_COLOURS.better}>{testBetter(tests(better))}</Text> : null}
        {completed.map((run, index) => (
          <Text key={index} color={TEXT_COLOURS.completed}>
            {testComplete(quote(run.name))})
          </Text>
        ))}
        {same ? <Text color={TEXT_COLOURS.same}>{testSame(tests(same))}</Text> : null}
        {skipped ? <Text color={TEXT_COLOURS.skipped}>{testSkipped(tests(skipped))}</Text> : null}
        {updated ? <Text color={TEXT_COLOURS.updated}>{testUpdated(tests(updated))}</Text> : null}
        {worse ? (
          <>
            <Box paddingBottom={1}>
              <Text color={TEXT_COLOURS.worse}>{testWorse(tests(worse))}</Text>
            </Box>
            {!context.config.strict && <Text>{updateInstructions()}</Text>}
          </>
        ) : null}
      </Box>
      {summary.unexpectedDiff ? (
        <Box flexDirection="column" paddingBottom={1}>
          <Text color={TEXT_COLOURS.diff}>{unexpectedDiff()}</Text>
          <Text>{diffΔ(summary.expected, summary.result)}</Text>
        </Box>
      ) : null}
    </>
  );
});

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
